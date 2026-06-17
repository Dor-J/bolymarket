import type { Store } from 'jotai/vanilla/store';
import { sportsGameStateAtomFamily } from '@/lib/atoms/sportsGameState';
import type { SportsGameState } from '@/types/polymarket';

const SPORTS_WS_URL = 'wss://sports-api.polymarket.com/ws';
const RECONNECT_DELAY_MS = 3_000;

interface SportsWsPayload {
  gameId?: number | string;
  leagueAbbreviation?: string;
  slug?: string;
  homeTeam?: string;
  awayTeam?: string;
  status?: string;
  score?: string;
  period?: string;
  elapsed?: string;
  live?: boolean;
  ended?: boolean;
}

function parseSportsGameState(payload: SportsWsPayload): SportsGameState | null {
  if (payload.gameId === undefined || payload.gameId === null) {
    return null;
  }

  return {
    gameId: String(payload.gameId),
    leagueAbbreviation: payload.leagueAbbreviation,
    slug: payload.slug,
    homeTeam: payload.homeTeam,
    awayTeam: payload.awayTeam,
    status: payload.status,
    score: payload.score,
    period: payload.period,
    elapsed: payload.elapsed,
    live: payload.live,
    ended: payload.ended,
  };
}

/**
 * Manages a shared Sports WebSocket connection for live scores.
 */
export function createSportsWebSocketEngine() {
  let socket: WebSocket | null = null;
  let activeStore: Store | null = null;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let shouldReconnect = false;

  function clearReconnectTimer(): void {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  }

  function scheduleReconnect(): void {
    if (!shouldReconnect || reconnectTimer) {
      return;
    }

    reconnectTimer = setTimeout(() => {
      reconnectTimer = null;
      connect();
    }, RECONNECT_DELAY_MS);
  }

  function handleMessage(event: MessageEvent<string>): void {
    if (!activeStore) {
      return;
    }

    if (event.data === 'ping') {
      socket?.send('pong');
      return;
    }

    try {
      const payload = JSON.parse(event.data) as SportsWsPayload;
      const state = parseSportsGameState(payload);
      if (!state) {
        return;
      }

      activeStore.set(sportsGameStateAtomFamily(state.gameId), state);
    } catch {
      // Ignore non-JSON frames.
    }
  }

  function connect(): void {
    if (typeof WebSocket === 'undefined' || !shouldReconnect) {
      return;
    }

    socket?.close();
    socket = new WebSocket(SPORTS_WS_URL);

    socket.addEventListener('open', () => {
      clearReconnectTimer();
    });

    socket.addEventListener('message', handleMessage);

    socket.addEventListener('close', () => {
      socket = null;
      scheduleReconnect();
    });

    socket.addEventListener('error', () => {
      socket?.close();
    });
  }

  return {
    start(store: Store): void {
      activeStore = store;
      shouldReconnect = true;
      connect();
    },
    stop(): void {
      shouldReconnect = false;
      clearReconnectTimer();
      socket?.close();
      socket = null;
      activeStore = null;
    },
  };
}

let engine: ReturnType<typeof createSportsWebSocketEngine> | null = null;
let subscriberCount = 0;

/**
 * Acquires the shared sports WebSocket engine (ref-counted singleton).
 */
export function acquireSportsWebSocketEngine(store: Store): { release: () => void } {
  if (!engine) {
    engine = createSportsWebSocketEngine();
  }

  subscriberCount += 1;
  if (subscriberCount === 1) {
    engine.start(store);
  }

  return {
    release() {
      subscriberCount = Math.max(0, subscriberCount - 1);
      if (subscriberCount === 0) {
        engine?.stop();
      }
    },
  };
}

/** Clears singleton state — test helper only. */
export function resetSportsWebSocketEngineForTests(): void {
  engine?.stop();
  engine = null;
  subscriberCount = 0;
}
