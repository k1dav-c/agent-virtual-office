import App from "@/App";
import { Auth0Provider } from "@auth0/auth0-react";
import { auth0Config } from "@config/auth0";
import React from "react";
import { createRoot } from "react-dom/client";

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <Auth0Provider
        domain={auth0Config.domain}
        clientId={auth0Config.clientId}
        authorizationParams={auth0Config.authorizationParams}
      >
        <App />
      </Auth0Provider>
    </React.StrictMode>
  );
}
