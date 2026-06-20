import type { Store } from 'jotai/vanilla/store';
import { appendTradeActivity } from '@/lib/atoms/tradeActivity';
import { enqueuePriceTick } from '@/lib/prices/coalesceTicks';
import type { OutcomePriceSeed } from '@/lib/prices/visibleOutcomeKeys';
import {
  buildRealtimeSubscriptionIndex,
  getRealtimeSubscriptionSignature,
} from './subscriptionIndex';
import { clampTradePrice, parseTradePayload } from './tradePayload';
import type { PriceSource } from './types';

const POLYMARKET_WS_URL = 'wss://ws-live-data.polymarket.com';
const ACTIVITY_TOPIC = 'activity';
const TRADE_TYPES = new Set(['trades', 'orders_matched']);
const PING_INTERVAL_MS = 5_000;
const RECONNECT_DELAY_MS = 2_000;

interface ActivitySubscription {
  topic: typeof ACTIVITY_TOPIC;
  type: 'trades' | 'orders_matched';
  filters?: string;
}

interface SubscriptionMessage {
  subscriptions: ActivitySubscription[];
}

interface ActivityMessage {
  topic?: string;
  type?: string;
  payload?: object;
}

/**
 * Creates a WebSocket price source backed by Polymarket's activity stream.
 */
export function createWebSocketEngine(): PriceSource & {
  isConnected: () => boolean;
} {
  let socket: WebSocket | null = null;
  let activeStore: Store | null = null;
  let assetToOutcomeKey = new Map<string, string>();
  let assetToEventSlug = new Map<string, string>();
  let subscribedEventSlugs: string[] = [];
  let activeSubscriptionMessage: SubscriptionMessage | null = null;
  let subscriptionSignature = "";
  let connected = false;
  let shouldReconnect = false;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let pingTimer: ReturnType<typeof setInterval> | null = null;

  function clearReconnectTimer(): void {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  }

  function clearPingTimer(): void {
    if (pingTimer) {
      clearInterval(pingTimer);
      pingTimer = null;
    }
  }

  function buildSubscriptionMessage(): SubscriptionMessage | null {
    if (subscribedEventSlugs.length === 0) {
      return null;
    }

    return {
      subscriptions: subscribedEventSlugs.flatMap((eventSlug) => [
        {
          topic: ACTIVITY_TOPIC,
          type: 'trades',
          filters: JSON.stringify({ event_slug: eventSlug }),
        },
        {
          topic: ACTIVITY_TOPIC,
          type: 'orders_matched',
          filters: JSON.stringify({ event_slug: eventSlug }),
        },
      ]),
    };
  }

  function sendSocketMessage(
    action: 'subscribe' | 'unsubscribe',
    message: SubscriptionMessage,
  ): void {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      return;
    }

    socket.send(JSON.stringify({ action, ...message }));
  }

  function syncVisibleEventSubscriptions(): void {
    if (activeSubscriptionMessage) {
      sendSocketMessage('unsubscribe', activeSubscriptionMessage);
      activeSubscriptionMessage = null;
    }

    const nextMessage = buildSubscriptionMessage();
    if (!nextMessage) {
      return;
    }

    sendSocketMessage('subscribe', nextMessage);
    activeSubscriptionMessage = nextMessage;
  }

  function handleActivityMessage(message: ActivityMessage): void {
    if (
      message.topic !== ACTIVITY_TOPIC ||
      typeof message.type !== 'string' ||
      !TRADE_TYPES.has(message.type)
    ) {
      return;
    }

    if (!message.payload) {
      return;
    }

    const trade = parseTradePayload(message.payload);
    if (!trade?.asset || trade.price === undefined) {
      return;
    }

    const outcomeKey = assetToOutcomeKey.get(trade.asset);
    const clampedPrice = clampTradePrice(trade.price);

    if (outcomeKey) {
      enqueuePriceTick(outcomeKey, clampedPrice);
    }

    const eventSlug =
      trade.eventSlug ?? assetToEventSlug.get(trade.asset ?? '');

    if (eventSlug && activeStore) {
      appendTradeActivity(activeStore, eventSlug, {
        price: clampedPrice,
        side: trade.side,
        timestamp: trade.timestamp ?? Date.now(),
        assetId: trade.asset,
        size: trade.size,
        outcome: trade.outcome,
        userName: trade.userName,
        transactionHash: trade.transactionHash,
      });
    }
  }

  function handleMessage(event: MessageEvent): void {
    if (typeof event.data !== 'string' || event.data.length === 0) {
      return;
    }

    if (event.data === 'pong' || event.data === 'ping') {
      return;
    }

    try {
      handleActivityMessage(JSON.parse(event.data) as ActivityMessage);
    } catch {
      // Ignore non-JSON protocol frames from the Polymarket stream.
    }
  }

  function startHeartbeat(): void {
    clearPingTimer();
    pingTimer = setInterval(() => {
      if (socket?.readyState === WebSocket.OPEN) {
        socket.send('ping');
      }
    }, PING_INTERVAL_MS);
  }

  function scheduleReconnect(): void {
    if (!shouldReconnect || reconnectTimer) {
      return;
    }

    reconnectTimer = setTimeout(() => {
      reconnectTimer = null;
      connectClient();
    }, RECONNECT_DELAY_MS);
  }

  function connectClient(): void {
    if (socket || typeof window === 'undefined') {
      return;
    }

    shouldReconnect = true;
    socket = new WebSocket(POLYMARKET_WS_URL);

    socket.addEventListener('open', () => {
      connected = true;
      clearReconnectTimer();
      startHeartbeat();
      activeSubscriptionMessage = null;
      syncVisibleEventSubscriptions();
    });

    socket.addEventListener('message', handleMessage);

    socket.addEventListener('close', () => {
      socket = null;
      connected = false;
      clearPingTimer();
      activeSubscriptionMessage = null;
      scheduleReconnect();
    });

    socket.addEventListener('error', () => {
      // The close event drives reconnect and fallback; avoid noisy console.error
      // events from transient browser WebSocket failures.
      if (socket && socket.readyState !== WebSocket.CLOSING) {
        socket.close();
      }
    });
  }

  function disconnectClient(): void {
    shouldReconnect = false;
    clearReconnectTimer();
    clearPingTimer();
    socket?.close(1000, 'Client shutdown');
    socket = null;
    connected = false;
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

    if (socket && connected) {
      syncVisibleEventSubscriptions();
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
      assetToEventSlug = new Map();
      subscribedEventSlugs = [];
      activeSubscriptionMessage = null;
      subscriptionSignature = "";
    },
  };
}
