import { useAuth0 } from "@auth0/auth0-react";
import { createAuthenticatedHasuraClient } from "@lib/graphql-client";
import { useEffect, useRef } from "react";

const UPSERT_USER_MUTATION = `
  mutation UpsertUser($user_data: users_insert_input!) {
    insert_users_one(
      object: $user_data
      on_conflict: {
        constraint: users_pkey
        update_columns: [
          email
          email_verified
          name
          given_name
          family_name
          nickname
          picture
          last_login
          timezone
          locale
        ]
      }
    ) {
      id
      email
      name
    }
  }
`;

export function useUserSync(): void {
  const { isAuthenticated, user, getIdTokenClaims } = useAuth0();
  const hasSyncedRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated || !user || hasSyncedRef.current) {
      return;
    }

    const syncUser = async () => {
      try {
        const client = await createAuthenticatedHasuraClient(getIdTokenClaims);

        await client.request(UPSERT_USER_MUTATION, {
          user_data: {
            email: user.email,
            email_verified: user.email_verified ?? false,
            name: user.name ?? null,
            given_name: user.given_name ?? null,
            family_name: user.family_name ?? null,
            nickname: user.nickname ?? null,
            picture: user.picture ?? null,
            last_login: new Date().toISOString(),
            timezone: "Asia/Taipei",
            locale: "zh-TW",
          },
        });

        hasSyncedRef.current = true;
      } catch (error) {
        console.error("User sync failed:", error);
      }
    };

    syncUser();
  }, [isAuthenticated, user, getIdTokenClaims]);
}
