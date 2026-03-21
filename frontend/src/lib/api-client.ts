import { IdToken } from "@auth0/auth0-react";

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) throw new Error("VITE_API_URL 環境變數未設定");

export class ApiClient {
  private baseUrl: string;
  private token: string;

  constructor(token: string, baseUrl: string = API_URL) {
    this.token = token;
    this.baseUrl = baseUrl;
  }

  private async request<T = unknown>(
    path: string,
    options: RequestInit = {},
  ): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(`${res.status}: ${JSON.stringify(data)}`);
    }
    return data as T;
  }

  get<T = unknown>(path: string): Promise<T> {
    return this.request<T>(path, { method: "GET" });
  }

  post<T = unknown>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  put<T = unknown>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  delete<T = unknown>(path: string): Promise<T> {
    return this.request<T>(path, { method: "DELETE" });
  }
}

export function createApiClient(token: string): ApiClient {
  return new ApiClient(token);
}

export async function createAuthenticatedApiClient(
  getIdTokenClaims: () => Promise<IdToken | undefined>,
): Promise<ApiClient> {
  const claims = await getIdTokenClaims();
  if (!claims?.__raw) {
    throw new Error("Unable to get id_token");
  }
  return new ApiClient(claims.__raw);
}
