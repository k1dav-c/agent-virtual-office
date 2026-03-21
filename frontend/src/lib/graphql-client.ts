import { IdToken } from "@auth0/auth0-react";
import { GraphQLClient } from "graphql-request";

const HASURA_ENDPOINT = import.meta.env.VITE_HASURA_ENDPOINT;
if (!HASURA_ENDPOINT) throw new Error("VITE_HASURA_ENDPOINT 環境變數未設定");

export function createUserHasuraClient(accessToken: string): GraphQLClient {
  const endpoint = HASURA_ENDPOINT.endsWith("/v1/graphql")
    ? HASURA_ENDPOINT
    : `${HASURA_ENDPOINT}/v1/graphql`;

  return new GraphQLClient(endpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

/**
 * 創建帶有 Auth0 整合的 Hasura 客戶端
 * 這個函數會自動處理從 Auth0 獲取 ID token 並創建客戶端
 */
export async function createAuthenticatedHasuraClient(
  getIdTokenClaims: () => Promise<IdToken | undefined>,
): Promise<GraphQLClient> {
  const idTokenClaims = await getIdTokenClaims();

  if (!idTokenClaims?.__raw) {
    throw new Error("無法獲取 Auth0 ID Token");
  }

  return createUserHasuraClient(idTokenClaims.__raw);
}
