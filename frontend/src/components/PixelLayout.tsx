import { useAuth0 } from "@auth0/auth0-react";
import { Link, useLocation } from "react-router-dom";

const MONO = "'Courier New', monospace";

const NAV_ITEMS = [
  { to: "/", label: "🏠 HOME" },
  { to: "/office", label: "🏢 OFFICE" },
  { to: "/dashboard", label: "🔧 CONFIG" },
];

export default function PixelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth0();
  const { pathname } = useLocation();

  return (
    <div
      className="h-screen w-screen flex flex-col overflow-hidden"
      style={{ background: "#2e3440", fontFamily: MONO }}
    >
      {/* ── Game HUD top bar ── */}
      <header
        className="flex-shrink-0 z-30 flex items-stretch justify-between"
        style={{
          background: "#2e3440",
          borderBottom: "4px solid #4c566a",
          imageRendering: "pixelated",
        }}
      >
        {/* Left: logo + nav */}
        <div className="flex items-stretch">
          <Link
            to="/"
            className="flex items-center text-[#eceff4] font-bold text-xs tracking-wider px-4"
            style={{ borderRight: "3px solid #4c566a" }}
          >
            🏢 AVO
          </Link>
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center px-4 py-2 text-[11px] font-bold tracking-wide transition-colors"
                style={{
                  background: active ? "#5e81ac" : "transparent",
                  color: active ? "#eceff4" : "#6b7994",
                  borderRight: "3px solid #4c566a",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Right: user + quit */}
        <div className="flex items-stretch">
          <div
            className="flex items-center gap-2 px-3"
            style={{ borderLeft: "3px solid #4c566a" }}
          >
            {user?.picture && (
              <img
                src={user.picture}
                alt={user.name || ""}
                className="w-5 h-5"
                style={{ border: "2px solid #4c566a", borderRadius: 1 }}
              />
            )}
            <span className="text-[10px] text-[#8892a6] hidden sm:inline">
              {user?.name}
            </span>
          </div>
          <button
            onClick={() => {
              localStorage.clear();
              logout({ logoutParams: { returnTo: window.location.origin } });
            }}
            className="px-3 py-2 text-[10px] font-bold cursor-pointer transition-colors"
            style={{
              color: "#bf616a",
              background: "#2e3440",
              borderLeft: "3px solid #4c566a",
              fontFamily: MONO,
            }}
          >
            ✕ QUIT
          </button>
        </div>
      </header>

      {/* ── Full-screen game world — green tiled floor ── */}
      <main
        className="flex-1 overflow-auto relative"
        style={{
          backgroundColor: "#8ec58e",
          backgroundImage: `
            linear-gradient(45deg, #82b882 25%, transparent 25%),
            linear-gradient(-45deg, #82b882 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #82b882 75%),
            linear-gradient(-45deg, transparent 75%, #82b882 75%)
          `,
          backgroundSize: "40px 40px",
          backgroundPosition: "0 0, 0 20px, 20px -20px, -16px 0px",
          imageRendering: "pixelated",
        }}
      >
        {children}
      </main>
    </div>
  );
}
