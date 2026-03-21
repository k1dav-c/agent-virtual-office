import { useAuth0 } from "@auth0/auth0-react";
import { gql } from "graphql-request";
import { useCallback, useEffect, useState } from "react";

import Button from "@components/ui/Button";
import { createAuthenticatedHasuraClient } from "@lib/graphql-client";
import type { ApiKeyItem } from "../types/agent";

const MONO = "'Courier New', monospace";
const KEY_PREFIX_TAG = "avo_";

function generateApiKey(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${KEY_PREFIX_TAG}${hex}`;
}

async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const LIST_KEYS = gql`
  query ListApiKeys {
    api_keys(order_by: { created_at: desc }) {
      id
      key_prefix
      name
      created_at
      last_used_at
      is_active
    }
  }
`;
const INSERT_KEY = gql`
  mutation InsertApiKey(
    $key_hash: String!
    $key_prefix: String!
    $name: String!
  ) {
    insert_api_keys_one(
      object: { key_hash: $key_hash, key_prefix: $key_prefix, name: $name }
    ) {
      id
    }
  }
`;
const REVOKE_KEY = gql`
  mutation RevokeApiKey($key_id: uuid!) {
    update_api_keys_by_pk(
      pk_columns: { id: $key_id }
      _set: { is_active: false }
    ) {
      id
    }
  }
`;
const DELETE_KEY = gql`
  mutation DeleteApiKey($key_id: uuid!) {
    delete_api_keys_by_pk(id: $key_id) {
      id
    }
  }
`;

export default function ApiKeyManager() {
  const { getIdTokenClaims } = useAuth0();
  const [keys, setKeys] = useState<ApiKeyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [keyName, setKeyName] = useState("Default");
  const [copied, setCopied] = useState(false);

  const fetchKeys = useCallback(async () => {
    try {
      const client = await createAuthenticatedHasuraClient(getIdTokenClaims);
      const data = await client.request<{ api_keys: ApiKeyItem[] }>(LIST_KEYS);
      setKeys(data.api_keys);
    } catch (err) {
      console.error("Failed to fetch API keys:", err);
    } finally {
      setLoading(false);
    }
  }, [getIdTokenClaims]);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const rawKey = generateApiKey();
      const keyHash = await sha256(rawKey);
      const keyPrefix = rawKey.slice(0, 12) + "...";
      const client = await createAuthenticatedHasuraClient(getIdTokenClaims);
      await client.request(INSERT_KEY, {
        key_hash: keyHash,
        key_prefix: keyPrefix,
        name: keyName,
      });
      setNewKey(rawKey);
      setKeyName("Default");
      await fetchKeys();
    } catch (err) {
      console.error("Failed to create API key:", err);
    } finally {
      setCreating(false);
    }
  };

  const handleRevoke = async (keyId: string) => {
    try {
      const client = await createAuthenticatedHasuraClient(getIdTokenClaims);
      await client.request(REVOKE_KEY, { key_id: keyId });
      await fetchKeys();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (keyId: string) => {
    try {
      const client = await createAuthenticatedHasuraClient(getIdTokenClaims);
      await client.request(DELETE_KEY, { key_id: keyId });
      await fetchKeys();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4" style={{ fontFamily: MONO }}>
      {/* ── Create ── */}
      <div className="flex gap-3">
        <input
          type="text"
          value={keyName}
          onChange={(e) => setKeyName(e.target.value)}
          placeholder="Key name"
          className="flex-1 px-3 py-2 text-xs text-[#eceff4] focus:outline-none placeholder-[#6b7994]"
          style={{
            background: "#3b4252",
            border: "3px solid #4c566a",
            borderRadius: 2,
            fontFamily: MONO,
          }}
        />
        <Button
          variant="primary"
          size="md"
          onClick={handleCreate}
          loading={creating}
        >
          🔑 Generate
        </Button>
      </div>

      {/* ── New key flash ── */}
      {newKey && (
        <div
          className="p-4"
          style={{
            background: "rgba(163, 190, 140, 0.2)",
            border: "3px solid #a3be8c",
            borderRadius: 2,
            boxShadow: "4px 4px 0 rgba(0,0,0,0.3)",
          }}
        >
          <p className="text-[11px] font-bold text-[#a3be8c] mb-2">
            ✅ 新 Key 已產生！請立即複製，離開後無法再查看。
          </p>
          <div className="flex items-center gap-2">
            <code
              className="flex-1 text-[10px] px-3 py-2 break-all text-[#a3be8c]"
              style={{
                background: "#2e3440",
                border: "2px solid #4c566a",
                borderRadius: 2,
              }}
            >
              {newKey}
            </code>
            <Button
              variant={copied ? "secondary" : "primary"}
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(newKey);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              {copied ? "✓ OK" : "📋 Copy"}
            </Button>
          </div>
        </div>
      )}

      {/* ── Key list ── */}
      {loading ? (
        <p className="text-[11px] text-[#6b7994]">⏳ Loading...</p>
      ) : keys.length === 0 ? (
        <p className="text-[11px] text-[#6b7994]">🔒 尚未建立任何 Key。</p>
      ) : (
        <div className="space-y-2">
          {keys.map((key) => (
            <div
              key={key.id}
              className="flex items-center justify-between p-3"
              style={{
                background: key.is_active
                  ? "rgba(59, 66, 82, 0.7)"
                  : "rgba(59, 66, 82, 0.4)",
                border: "3px solid #4c566a",
                borderRadius: 2,
                opacity: key.is_active ? 1 : 0.6,
              }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="font-bold text-[#d8dee9]">{key.name}</span>
                  <code
                    className="px-2 py-0.5 text-[9px] flex-shrink-0"
                    style={{
                      background: "#2e3440",
                      color: "#a3be8c",
                      borderRadius: 2,
                      border: "1px solid #4c566a",
                    }}
                  >
                    {key.key_prefix}
                  </code>
                  {!key.is_active && (
                    <span className="text-[9px] font-bold text-[#bf616a]">
                      ⛔ REVOKED
                    </span>
                  )}
                </div>
                <div className="text-[9px] text-[#6b7994] mt-1">
                  📅 {new Date(key.created_at).toLocaleDateString()}
                  {key.last_used_at &&
                    ` · 🕐 ${new Date(key.last_used_at).toLocaleDateString()}`}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {key.is_active ? (
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleRevoke(key.id)}
                  >
                    ⚠️ Revoke
                  </Button>
                ) : (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(key.id)}
                  >
                    🗑️ Delete
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
