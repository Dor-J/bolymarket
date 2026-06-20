import { createStore } from 'jotai';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  sportsGameStateAtomFamily,
  sportsGameStateLookupAtomFamily,
} from '@/lib/atoms/sportsGameState';
import {
  acquireSportsWebSocketEngine,
  createSportsWebSocketEngine,
  resetSportsWebSocketEngineForTests,
} from './sportsWebSocketEngine';

type MockWebSocketEvent = Event | MessageEvent;
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

function cleanupSportsAtomFamilies(): void {
  for (const key of sportsGameStateAtomFamily.getParams()) {
    sportsGameStateAtomFamily.remove(key);
  }

  for (const key of sportsGameStateLookupAtomFamily.getParams()) {
    sportsGameStateLookupAtomFamily.remove(key);
  }
}

describe('createSportsWebSocketEngine', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal('WebSocket', MockWebSocket);
  });

  afterEach(() => {
    resetSportsWebSocketEngineForTests();
    cleanupSportsAtomFamilies();
    MockWebSocket.instances = [];
    vi.unstubAllGlobals();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('opens the sports websocket endpoint', () => {
    const engine = createSportsWebSocketEngine();

    engine.start(createStore());

    expect(MockWebSocket.instances).toHaveLength(1);
    expect(MockWebSocket.instances[0]?.url).toBe(
      'wss://sports-api.polymarket.com/ws',
    );

    engine.stop();
  });

  it('responds to ping frames with pong', () => {
    const engine = createSportsWebSocketEngine();
    engine.start(createStore());

    const socket = MockWebSocket.instances[0]!;
    socket.message('ping');

    expect(socket.sent).toEqual(['pong']);

    engine.stop();
  });

  it('stores valid game state payloads with slug and matchup aliases', () => {
    const store = createStore();
    const engine = createSportsWebSocketEngine();
    engine.start(store);

    MockWebSocket.instances[0]!.message(
      JSON.stringify({
        gameId: 123,
        slug: 'France vs. Brazil - more markets',
        homeTeam: 'France',
        awayTeam: 'Brazil',
        score: '2-1',
        live: true,
      }),
    );

    expect(store.get(sportsGameStateAtomFamily('123'))).toEqual(
      expect.objectContaining({
        gameId: '123',
        slug: 'France vs. Brazil - more markets',
        score: '2-1',
      }),
    );
    expect(
      store.get(
        sportsGameStateLookupAtomFamily('France vs. Brazil - more markets'),
      ),
    ).toEqual(expect.objectContaining({ gameId: '123' }));
    expect(store.get(sportsGameStateLookupAtomFamily('france vs. brazil'))).toEqual(
      expect.objectContaining({ gameId: '123' }),
    );

    engine.stop();
  });

  it('ignores malformed JSON and payloads without game ids', () => {
    const store = createStore();
    const engine = createSportsWebSocketEngine();
    engine.start(store);

    const socket = MockWebSocket.instances[0]!;
    socket.message('{bad json');
    socket.message(JSON.stringify({ slug: 'france-vs-brazil' }));

    expect(Array.from(sportsGameStateAtomFamily.getParams())).toEqual([]);

    engine.stop();
  });

  it('reconnects after close while active and stops reconnecting after stop', () => {
    const engine = createSportsWebSocketEngine();
    engine.start(createStore());

    MockWebSocket.instances[0]!.close();
    expect(MockWebSocket.instances).toHaveLength(1);

    vi.advanceTimersByTime(3_000);
    expect(MockWebSocket.instances).toHaveLength(2);

    engine.stop();
    MockWebSocket.instances[1]!.close();
    vi.advanceTimersByTime(3_000);
    expect(MockWebSocket.instances).toHaveLength(2);
  });
});

describe('acquireSportsWebSocketEngine', () => {
  beforeEach(() => {
    vi.stubGlobal('WebSocket', MockWebSocket);
  });

  afterEach(() => {
    resetSportsWebSocketEngineForTests();
    MockWebSocket.instances = [];
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('starts once and stops after the final subscriber releases', () => {
    const leaseA = acquireSportsWebSocketEngine(createStore());
    const firstSocket = MockWebSocket.instances[0]!;
    const closeSpy = vi.spyOn(firstSocket, 'close');

    const leaseB = acquireSportsWebSocketEngine(createStore());

    expect(MockWebSocket.instances).toHaveLength(1);
    leaseA.release();
    expect(closeSpy).not.toHaveBeenCalled();

    leaseB.release();
    expect(closeSpy).toHaveBeenCalledTimes(1);
  });
});
