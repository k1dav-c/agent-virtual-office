import { useCallback, useState } from "react";

const STORAGE_KEY = "office-session-nicknames";

type NicknameMap = Record<string, string>;

function load(): NicknameMap {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

export function useSessionNicknames() {
  const [nicknames, setNicknames] = useState<NicknameMap>(load);

  const setNickname = useCallback((sessionId: string, name: string) => {
    setNicknames((prev) => {
      const next = { ...prev };
      const trimmed = name.trim();
      if (trimmed) {
        next[sessionId] = trimmed;
      } else {
        delete next[sessionId];
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const getNickname = useCallback(
    (sessionId: string) => nicknames[sessionId] || null,
    [nicknames],
  );

  return { getNickname, setNickname };
}
