import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "@components/LogoutButton";
import { createAuthenticatedApiClient } from "@lib/api-client";
import { createAuthenticatedWsClient, WsClient } from "@lib/ws-client";
import { useRef, useState } from "react";

const CARD = "bg-white p-6 rounded-lg shadow-md w-full max-w-md";
const BTN =
  "w-full px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer text-white";

const HomePage = () => {
  const { user, getIdTokenClaims } = useAuth0();
  const [apiResult, setApiResult] = useState<string | null>(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [wsStatus, setWsStatus] = useState<
    "disconnected" | "connecting" | "connected"
  >("disconnected");
  const [wsMessages, setWsMessages] = useState<string[]>([]);
  const [wsInput, setWsInput] = useState("");
  const wsRef = useRef<WsClient | null>(null);

  const testApi = async () => {
    setApiLoading(true);
    setApiResult(null);
    try {
      const client = await createAuthenticatedApiClient(getIdTokenClaims);
      setApiResult(JSON.stringify(await client.get("/api/auth/me"), null, 2));
    } catch (err) {
      setApiResult(`Error: ${err instanceof Error ? err.message : err}`);
    } finally {
      setApiLoading(false);
    }
  };

  const connectWs = async () => {
    wsRef.current?.close();
    setWsStatus("connecting");
    setWsMessages([]);
    try {
      const client = await createAuthenticatedWsClient(getIdTokenClaims);
      wsRef.current = client;
      client.onOpen = () => setWsStatus("connected");
      client.onMessage = (d) => setWsMessages((p) => [...p, JSON.stringify(d)]);
      client.onClose = (code, reason) => {
        setWsStatus("disconnected");
        if (code === 4001) setWsMessages((p) => [...p, `Closed: ${reason}`]);
        wsRef.current = null;
      };
      client.onError = () => {
        setWsStatus("disconnected");
        setWsMessages((p) => [...p, "Connection error"]);
        wsRef.current = null;
      };
      client.connect("/api/auth/ws");
    } catch (err) {
      setWsStatus("disconnected");
      setWsMessages([`Error: ${err instanceof Error ? err.message : err}`]);
    }
  };

  const sendWs = () => {
    if (!wsRef.current || !wsInput.trim()) return;
    wsRef.current.send(wsInput.trim());
    setWsInput("");
  };

  const statusDot = {
    disconnected: "bg-gray-400",
    connecting: "bg-yellow-400",
    connected: "bg-green-500",
  }[wsStatus];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-6 p-6">
      {/* User Info */}
      <div className={`${CARD} p-8 text-center`}>
        <h1 className="text-2xl font-bold mb-4">Welcome!</h1>
        {user && (
          <div className="mb-6">
            <p className="text-lg">{user.name}</p>
            <p className="text-gray-600">{user.email}</p>
            {user.picture && (
              <img
                src={user.picture}
                alt={user.name}
                className="rounded-full w-24 h-24 mx-auto mt-4"
              />
            )}
          </div>
        )}
        <LogoutButton />
      </div>

      {/* API Test */}
      <div className={CARD}>
        <h2 className="text-lg font-semibold mb-3">API Test</h2>
        <button
          onClick={testApi}
          disabled={apiLoading}
          className={`${BTN} bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed`}
        >
          {apiLoading ? "Testing..." : "GET /api/auth/me"}
        </button>
        {apiResult && (
          <pre className="mt-3 p-3 bg-gray-50 rounded text-xs text-left overflow-auto max-h-40 border">
            {apiResult}
          </pre>
        )}
      </div>

      {/* WebSocket Test */}
      <div className={CARD}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">WebSocket Test</h2>
          <span className="flex items-center gap-2 text-sm text-gray-600">
            <span className={`w-2.5 h-2.5 rounded-full ${statusDot}`} />
            {wsStatus}
          </span>
        </div>

        {wsStatus === "disconnected" ? (
          <button
            onClick={connectWs}
            className={`${BTN} bg-green-600 hover:bg-green-700`}
          >
            Connect
          </button>
        ) : (
          <button
            onClick={() => {
              wsRef.current?.close();
              wsRef.current = null;
            }}
            className={`${BTN} bg-red-600 hover:bg-red-700`}
          >
            Disconnect
          </button>
        )}

        {wsStatus === "connected" && (
          <div className="flex gap-2 mt-3">
            <input
              value={wsInput}
              onChange={(e) => setWsInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendWs()}
              placeholder="Type a message..."
              className="flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={sendWs}
              className={`${BTN} w-auto bg-blue-600 hover:bg-blue-700`}
            >
              Send
            </button>
          </div>
        )}

        {wsMessages.length > 0 && (
          <div className="mt-3 p-3 bg-gray-50 rounded border max-h-40 overflow-auto">
            {wsMessages.map((msg, i) => (
              <div key={i} className="text-xs font-mono py-0.5">
                {msg}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
