import { IdToken } from "@auth0/auth0-react";

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) throw new Error("VITE_API_URL 環境變數未設定");

export type WsMessageHandler = (data: unknown) => void;

export class WsClient {
  private ws: WebSocket | null = null;
  private token: string;
  private baseUrl: string;
  private authenticated = false;

  onOpen: (() => void) | null = null;
  onClose: ((code: number, reason: string) => void) | null = null;
  onMessage: WsMessageHandler | null = null;
  onError: (() => void) | null = null;

  constructor(token: string, baseUrl: string = API_URL) {
    this.token = token;
    this.baseUrl = baseUrl.replace(/^http/, "ws");
  }

  connect(path: string): void {
    this.close();
    this.authenticated = false;
    this.ws = new WebSocket(`${this.baseUrl}${path}`);

    this.ws.onopen = () => {
      // Send connection_init with token as first message
      this.ws?.send(
        JSON.stringify({
          type: "connection_init",
          payload: { token: this.token },
        }),
      );
    };

    this.ws.onmessage = (e) => {
      let data: unknown;
      try {
        data = JSON.parse(e.data);
      } catch {
        data = e.data;
      }

      const msg = data as Record<string, unknown>;

      if (msg?.type === "connection_ack") {
        this.authenticated = true;
        this.onOpen?.();
        this.onMessage?.(data);
        return;
      }

      if (msg?.type === "connection_error") {
        this.onMessage?.(data);
        return;
      }

      this.onMessage?.(data);
    };

    this.ws.onclose = (e) => this.onClose?.(e.code, e.reason);
    this.ws.onerror = () => this.onError?.();
  }

  send(data: string | object): void {
    if (!this.authenticated || this.ws?.readyState !== WebSocket.OPEN) return;
    this.ws.send(typeof data === "string" ? data : JSON.stringify(data));
  }

  close(): void {
    this.ws?.close();
    this.ws = null;
    this.authenticated = false;
  }

  get readyState(): number | undefined {
    return this.ws?.readyState;
  }

  get isAuthenticated(): boolean {
    return this.authenticated;
  }
}

export function createWsClient(token: string): WsClient {
  return new WsClient(token);
}

export async function createAuthenticatedWsClient(
  getIdTokenClaims: () => Promise<IdToken | undefined>,
): Promise<WsClient> {
  const claims = await getIdTokenClaims();
  if (!claims?.__raw) {
    throw new Error("Unable to get id_token");
  }
  return new WsClient(claims.__raw);
}
