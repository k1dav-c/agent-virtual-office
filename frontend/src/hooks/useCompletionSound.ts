import { useCallback, useEffect, useRef, useState } from "react";

import type { AgentSession } from "../types/agent";

const STORAGE_KEY = "office-sound-enabled";

function playChime() {
  try {
    const ctx = new AudioContext();
    const now = ctx.currentTime;

    // Two-tone chime: C5 → E5
    for (const [freq, offset] of [
      [523.25, 0],
      [659.25, 0.12],
    ] as const) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.18, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.4);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.4);
    }

    // Clean up context after sounds finish
    setTimeout(() => ctx.close(), 1000);
  } catch {
    // Audio not available — silently ignore
  }
}

export function useCompletionSound(sessions: AgentSession[]) {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === null ? true : stored === "true";
  });

  const prevStatusMap = useRef<Map<string, string>>(new Map());
  const initialized = useRef(false);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  useEffect(() => {
    // On first data load, just record the current state — don't play sound
    if (!initialized.current) {
      if (sessions.length > 0) {
        const map = new Map<string, string>();
        for (const s of sessions) {
          map.set(s.id, s.status);
        }
        prevStatusMap.current = map;
        initialized.current = true;
      }
      return;
    }

    let shouldPlay = false;
    const newMap = new Map<string, string>();

    for (const s of sessions) {
      const prev = prevStatusMap.current.get(s.id);
      if (prev && prev !== "complete" && s.status === "complete") {
        shouldPlay = true;
      }
      newMap.set(s.id, s.status);
    }

    prevStatusMap.current = newMap;

    if (shouldPlay && soundEnabled) {
      playChime();
    }
  }, [sessions, soundEnabled]);

  return { soundEnabled, toggleSound };
}
