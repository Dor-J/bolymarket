import {
  ConnectionStatus,
  RealTimeDataClient,
  type Message,
} from '@polymarket/real-time-data-client';
import type { Store } from 'jotai/vanilla/store';
import { appendTradeActivity } from '@/lib/atoms/tradeActivity';
import { enqueuePriceTick } from '@/lib/prices/coalesceTicks';
import type { OutcomePriceSeed } from '@/lib/prices/visibleOutcomeKeys';
import {
  buildRealtimeSubscriptionIndex,
  getRealtimeSubscriptionSignature,
} from './subscriptionIndex';
import { clampTradePrice, parseTradePayload } from './tradePayload';
import {
  disablePolymarketWsLogSuppression,
  enablePolymarketWsLogSuppression,
} from './suppressPolymarketWsLogs';
import type { PriceSource } from './types';

const ACTIVITY_TOPIC = 'activity';
const TRADE_TYPES = new Set(['trades', 'orders_matched']);

export interface WebSocketEngineOptions {
  /** When true, falls back to no-op ticks when disconnected. */
  trackConnection?: boolean;
}

/**
 * Creates a WebSocket price source backed by `@polymarket/real-time-data-client`.
 */
export function createWebSocketEngine(
  options: WebSocketEngineOptions = {},
): PriceSource & { isConnected: () => boolean } {
  let client: RealTimeDataClient | null = null;
  let activeStore: Store | null = null;
  let assetToOutcomeKey = new Map<string, string>();
  let assetToEventSlug = new Map<string, string>();
  let subscribedEventSlugs: string[] = [];
  let subscriptionSignature = "";
  let connected = false;
  let disableLogTimer: ReturnType<typeof setTimeout> | null = null;

  function cancelPendingLogSuppressionDisable(): void {
    if (disableLogTimer) {
      clearTimeout(disableLogTimer);
      disableLogTimer = null;
    }
  }

  function scheduleLogSuppressionDisable(): void {
    cancelPendingLogSuppressionDisable();
    disableLogTimer = setTimeout(() => {
      disableLogTimer = null;
      disablePolymarketWsLogSuppression();
    }, 500);
  }

  function subscribeToVisibleEvents(nextClient: RealTimeDataClient): void {
    if (subscribedEventSlugs.length === 0) {
      nextClient.subscribe({
        subscriptions: [
          {
            topic: ACTIVITY_TOPIC,
            type: "trades",
          },
        ],
      });
      return;
    }

    for (const eventSlug of subscribedEventSlugs) {
      nextClient.subscribe({
        subscriptions: [
          {
            topic: ACTIVITY_TOPIC,
            type: "trades",
            filters: JSON.stringify({ event_slug: eventSlug }),
          },
          {
            topic: ACTIVITY_TOPIC,
            type: "orders_matched",
            filters: JSON.stringify({ event_slug: eventSlug }),
          },
        ],
      });
    }
  }

  function handleMessage(_rtClient: RealTimeDataClient, message: Message): void {
    if (message.topic !== ACTIVITY_TOPIC || !TRADE_TYPES.has(message.type)) {
      return;
    }

    const trade = parseTradePayload(message.payload);
    if (!trade?.asset || trade.price === undefined) {
      return;
    }

    const outcomeKey = assetToOutcomeKey.get(trade.asset);
    if (!outcomeKey) {
      return;
    }

    const clampedPrice = clampTradePrice(trade.price);
    enqueuePriceTick(outcomeKey, clampedPrice);

    const eventSlug =
      trade.eventSlug ?? assetToEventSlug.get(trade.asset ?? '');

    if (eventSlug && activeStore) {
      appendTradeActivity(activeStore, eventSlug, {
        price: clampedPrice,
        side: trade.side,
        timestamp: Date.now(),
        assetId: trade.asset,
      });
    }
  }

  function connectClient(): void {
    if (client || typeof window === "undefined") {
      return;
    }

    client = new RealTimeDataClient({
      autoReconnect: true,
      onConnect: (nextClient) => {
        connected = true;
        subscribeToVisibleEvents(nextClient);
      },
      onMessage: handleMessage,
      onStatusChange: (status) => {
        connected = status === ConnectionStatus.CONNECTED;
        if (options.trackConnection !== false && !connected) {
          // Connection state is observable via isConnected().
        }
      },
    });

    cancelPendingLogSuppressionDisable();
    enablePolymarketWsLogSuppression();
    client.connect();
  }

  function disconnectClient(): void {
    if (!client) {
      return;
    }

    client.disconnect();
    client = null;
    connected = false;
    scheduleLogSuppressionDisable();
  }

  function updateSubscriptions(seeds: OutcomePriceSeed[]): void {
    const index = buildRealtimeSubscriptionIndex(seeds);
    assetToOutcomeKey = index.assetToOutcomeKey;
    assetToEventSlug = index.assetToEventSlug;
    subscribedEventSlugs = index.eventSlugs;

    const nextSignature = getRealtimeSubscriptionSignature(seeds);
    if (nextSignature === subscriptionSignature) {
      return;
    }

    subscriptionSignature = nextSignature;

    if (client && connected) {
      subscribeToVisibleEvents(client);
    }
  }

  return {
    isConnected() {
      return connected;
    },

    start(_outcomeKeys: string[], store: Store, seeds: OutcomePriceSeed[] = []) {
      activeStore = store;
      updateSubscriptions(seeds);
      connectClient();
    },

    stop() {
      cancelPendingLogSuppressionDisable();
      disconnectClient();
      activeStore = null;
      assetToOutcomeKey = new Map();
      assetToEventSlug = new Map();
      subscribedEventSlugs = [];
      subscriptionSignature = "";
    },
  };
}
