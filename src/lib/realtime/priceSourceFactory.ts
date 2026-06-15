import { createSimulationEngine } from "./simulationEngine";
import type { PriceSource } from "./types";
import { createWebSocketEngine } from "./websocketEngine";

export type LivePriceMode = "websocket" | "simulation" | "auto";

const AUTO_FALLBACK_DELAY_MS = 2_000;
const AUTO_FALLBACK_POLL_MS = 500;

function resolveLivePriceMode(): LivePriceMode {
  const configured = process.env.NEXT_PUBLIC_LIVE_PRICE_MODE;

  if (
    configured === "websocket" ||
    configured === "simulation" ||
    configured === "auto"
  ) {
    return configured;
  }

  return "auto";
}

function createAutoEngine(): PriceSource {
  const websocket = createWebSocketEngine();
  const simulation = createSimulationEngine();
  let fallbackTimer: ReturnType<typeof setTimeout> | null = null;
  let pollTimer: ReturnType<typeof setInterval> | null = null;

  function clearTimers(): void {
    if (fallbackTimer) {
      clearTimeout(fallbackTimer);
      fallbackTimer = null;
    }

    if (pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
    }
  }

  return {
    start(outcomeKeys, store, seeds = []) {
      clearTimers();
      websocket.start(outcomeKeys, store, seeds);

      fallbackTimer = setTimeout(() => {
        if (!websocket.isConnected()) {
          simulation.start(outcomeKeys, store);
        }
      }, AUTO_FALLBACK_DELAY_MS);

      pollTimer = setInterval(() => {
        if (websocket.isConnected()) {
          simulation.stop();
        }
      }, AUTO_FALLBACK_POLL_MS);
    },
    stop() {
      clearTimers();
      websocket.stop();
      simulation.stop();
    },
  };
}

/**
 * Composite engine: WebSocket trades when available, simulation as fallback.
 */
export function createLivePriceEngine(): PriceSource {
  const mode = resolveLivePriceMode();

  if (mode === "simulation") {
    return createSimulationEngine();
  }

  if (mode === "websocket") {
    const websocket = createWebSocketEngine();
    return {
      start(outcomeKeys, store, seeds = []) {
        websocket.start(outcomeKeys, store, seeds);
      },
      stop() {
        websocket.stop();
      },
    };
  }

  return createAutoEngine();
}
