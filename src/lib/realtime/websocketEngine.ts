import {
  ConnectionStatus,
  RealTimeDataClient,
  type Message,
} from '@polymarket/real-time-data-client';
import type { Store } from 'jotai/vanilla/store';
import { enqueuePriceTick } from '@/lib/prices/coalesceTicks';
import type { OutcomePriceSeed } from '@/lib/prices/visibleOutcomeKeys';
import {
  buildRealtimeSubscriptionIndex,
  getRealtimeSubscriptionSignature,
} from './subscriptionIndex';
import { clampTradePrice, parseTradePayload } from './tradePayload';
import type { PriceSource } from './types';

const ACTIVITY_TOPIC = 'activity';
const TRADE_TYPES = new Set(['trades', 'orders_matched']);

/**
 * Suppresses the Polymarket client's noisy 1005 log on intentional disconnects.
 */
function disconnectClientQuietly(client: RealTimeDataClient): void {
  const originalError = console.error;

  console.error = (...args: unknown[]) => {
    const isIntentionalClose =
      args[0] === 'disconnected' &&
      (args[2] === 1005 || args[2] === 1000) &&
      (args[4] === '' || args[4] === 'Client shutdown');

    if (isIntentionalClose) {
      return;
    }

    originalError.apply(console, args);
  };

  try {
    client.disconnect();
  } finally {
    console.error = originalError;
  }
}

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
  let subscribedEventSlugs: string[] = [];
  let subscriptionSignature = "";
  let connected = false;

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

    enqueuePriceTick(outcomeKey, clampTradePrice(trade.price));
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

    client.connect();
  }

  function disconnectClient(): void {
    if (!client) {
      return;
    }

    disconnectClientQuietly(client);
    client = null;
    connected = false;
  }

  function updateSubscriptions(seeds: OutcomePriceSeed[]): void {
    const index = buildRealtimeSubscriptionIndex(seeds);
    assetToOutcomeKey = index.assetToOutcomeKey;
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
      disconnectClient();
      activeStore = null;
      assetToOutcomeKey = new Map();
      subscribedEventSlugs = [];
      subscriptionSignature = "";
    },
  };
}
