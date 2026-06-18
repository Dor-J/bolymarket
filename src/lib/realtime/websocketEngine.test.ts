import { createStore } from 'jotai';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { tradeActivityByEventAtom } from '@/lib/atoms/tradeActivity';
import { createWebSocketEngine } from './websocketEngine';

type MockWebSocketEvent = Event | MessageEvent | CloseEvent;
type MockListener = (event: MockWebSocketEvent) => void;

class MockWebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  static instances: MockWebSocket[] = [];

  readonly sent: string[] = [];
  readyState = MockWebSocket.CONNECTING;
  private readonly listeners = new Map<string, MockListener[]>();

  constructor(readonly url: string) {
    MockWebSocket.instances.push(this);
  }

  addEventListener(type: string, listener: MockListener): void {
    this.listeners.set(type, [...(this.listeners.get(type) ?? []), listener]);
  }

  send(message: string): void {
    this.sent.push(message);
  }

  close(): void {
    this.readyState = MockWebSocket.CLOSED;
    this.dispatch('close', new Event('close'));
  }

  open(): void {
    this.readyState = MockWebSocket.OPEN;
    this.dispatch('open', new Event('open'));
  }

  message(data: string): void {
    this.dispatch('message', new MessageEvent('message', { data }));
  }

  error(): void {
    this.dispatch('error', new Event('error'));
  }

  private dispatch(type: string, event: MockWebSocketEvent): void {
    for (const listener of this.listeners.get(type) ?? []) {
      listener(event);
    }
  }
}

describe('createWebSocketEngine', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    MockWebSocket.instances = [];
  });

  it('subscribes to visible event activity with native WebSocket messages', () => {
    vi.stubGlobal('WebSocket', MockWebSocket);
    const engine = createWebSocketEngine();

    engine.start(['market:token'], createStore(), [
      {
        outcomeKey: 'market:token',
        price: 0.5,
        assetId: 'token',
        eventSlug: 'world-cup-winner',
      },
    ]);

    const socket = MockWebSocket.instances[0]!;
    socket.open();

    expect(socket.url).toBe('wss://ws-live-data.polymarket.com');
    expect(JSON.parse(socket.sent[0]!)).toEqual({
      action: 'subscribe',
      subscriptions: [
        {
          topic: 'activity',
          type: 'trades',
          filters: JSON.stringify({ event_slug: 'world-cup-winner' }),
        },
        {
          topic: 'activity',
          type: 'orders_matched',
          filters: JSON.stringify({ event_slug: 'world-cup-winner' }),
        },
      ],
    });

    engine.stop();
  });

  it('appends real trade activity by event slug even when the asset is not charted', () => {
    vi.stubGlobal('WebSocket', MockWebSocket);
    const store = createStore();
    const engine = createWebSocketEngine();

    engine.start(['market:token'], store, [
      {
        outcomeKey: 'market:token',
        price: 0.5,
        assetId: 'token',
        eventSlug: 'world-cup-winner',
      },
    ]);

    const socket = MockWebSocket.instances[0]!;
    socket.open();
    socket.message(
      JSON.stringify({
        topic: 'activity',
        type: 'trades',
        payload: {
          asset: 'other-token',
          eventSlug: 'world-cup-winner',
          price: 0.42,
          size: 125,
          outcome: 'France',
          side: 'BUY',
          pseudonym: 'Trader',
          timestamp: 1_800_000_000,
        },
      }),
    );

    expect(store.get(tradeActivityByEventAtom)['world-cup-winner']).toEqual([
      expect.objectContaining({
        assetId: 'other-token',
        eventSlug: 'world-cup-winner',
        price: 0.42,
        size: 125,
      }),
    ]);

    engine.stop();
  });

  it('does not log browser WebSocket error events to console.error', () => {
    vi.stubGlobal('WebSocket', MockWebSocket);
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const engine = createWebSocketEngine();

    engine.start(['market:token'], createStore(), [
      {
        outcomeKey: 'market:token',
        price: 0.5,
        assetId: 'token',
        eventSlug: 'world-cup-winner',
      },
    ]);

    MockWebSocket.instances[0]!.error();

    expect(consoleError).not.toHaveBeenCalled();
    engine.stop();
  });
});
