import { useAuth0 } from "@auth0/auth0-react";
import { faSignOutAlt, faSliders } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { logout } = useAuth0();
  const navigate = useNavigate();
  const location = useLocation();

  const adminTabs = [
    {
      id: "overview",
      name: "總覽",
      icon: "📊",
      description: "系統總覽與統計資料",
      path: "/admin",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* 側邊欄 */}
      <aside className="w-64 bg-green-50 shadow-lg border-r border-green-200">
        <div className="p-6 border-b border-green-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-700 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon
                icon={faSliders}
                className="w-6 h-6 text-white"
              />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-800">
                管理員面板
              </h1>
              <p className="text-xs text-gray-500">系統管理與設定</p>
            </div>
          </div>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {adminTabs.map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => navigate(tab.path)}
                  className={`w-full flex items-start gap-3 px-3 py-3 rounded-lg text-left transition-colors cursor-pointer ${
                    location.pathname === tab.path
                      ? "bg-green-50 text-green-800 border-l-4 border-green-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium">{tab.name}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {tab.description}
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-4 left-4">
          <button
            onClick={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
            }
            className="flex items-center gap-2 px-3 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors cursor-pointer"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4" />
            登出
          </button>
        </div>
      </aside>

      {/* 主要內容區域 */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
