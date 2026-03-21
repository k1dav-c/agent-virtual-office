import { IdToken } from "@auth0/auth0-react";
import { Client, createClient } from "graphql-ws";

const HASURA_ENDPOINT = import.meta.env.VITE_HASURA_ENDPOINT;
if (!HASURA_ENDPOINT) throw new Error("VITE_HASURA_ENDPOINT 環境變數未設定");

const WS_URL = HASURA_ENDPOINT.replace("http://", "ws://").replace(
  "https://",
  "wss://",
);

export const createWebSocketClient = (
  getIdTokenClaims: () => Promise<IdToken | undefined>,
): Client => {
  return createClient({
    url: WS_URL,
    connectionParams: async () => {
      try {
        const claims = await getIdTokenClaims();
        return {
          headers: {
            Authorization: `Bearer ${claims?.__raw || ""}`,
          },
        };
      } catch (error) {
        console.error("Failed to get token claims:", error);
        return {};
      }
    },
    retryAttempts: 3,
    retryWait: (retryCount: number) =>
      new Promise((resolve) =>
        setTimeout(resolve, Math.min(1000 * 2 ** retryCount, 10000)),
      ),
  });
};

// 訂閱 hook
export const useSubscription = <T = any>(
  query: string,
  variables?: Record<string, any>,
  onData?: (data: T) => void,
  onError?: (error: Error) => void,
) => {
  let unsubscribe: (() => void) | null = null;

  const subscribe = (client: Client) => {
    if (unsubscribe) {
      unsubscribe();
    }

    unsubscribe = client.subscribe(
      {
        query,
        variables,
      },
      {
        next: (data: any) => {
          if (onData && data.data) {
            onData(data.data as T);
          }
        },
        error: (error: Error) => {
          console.error("Subscription error:", error);
          if (onError) {
            onError(error);
          }
        },
        complete: () => {
          console.log("Subscription completed");
        },
      },
    );
  };

  return {
    subscribe,
    unsubscribe: () => {
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }
    },
  };
};
