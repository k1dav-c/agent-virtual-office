import { useAuth0 } from "@auth0/auth0-react";
import {
  faExclamationTriangle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createAuthenticatedHasuraClient } from "@lib/graphql-client";
import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";

interface AdminAuthWrapperProps {
  children: React.ReactNode;
}

const AdminAuthWrapper: React.FC<AdminAuthWrapperProps> = ({ children }) => {
  const { isAuthenticated, isLoading, getIdTokenClaims, logout } = useAuth0();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);

  const checkAdminStatus = async () => {
    if (!isAuthenticated) {
      setIsCheckingAdmin(false);
      return;
    }

    try {
      const client = await createAuthenticatedHasuraClient(getIdTokenClaims);

      const query = `
        query GetUserAdminStatus($auth0_id: String!) {
          users(where: {id: {_eq: $auth0_id}}) {
            id
            is_admin
          }
        }
      `;

      const idTokenClaims = await getIdTokenClaims();
      const variables = {
        auth0_id: idTokenClaims?.sub,
      };

      const data = await client.request<{
        users: Array<{ id: string; is_admin: boolean; auth0_id: string }>;
      }>(query, variables);

      if (data.users.length > 0) {
        setIsAdmin(data.users[0].is_admin);
      } else {
        setIsAdmin(false);
      }
    } catch (err) {
      console.error("檢查管理員狀態失敗:", err);
      setIsAdmin(false);
    } finally {
      setIsCheckingAdmin(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      checkAdminStatus();
    } else {
      setIsCheckingAdmin(false);
    }
  }, [isAuthenticated]);

  // 載入中狀態
  if (isLoading || isCheckingAdmin) {
    return (
      <div className="relative flex justify-center items-center min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-slate-900"></div>
        <div className="relative bg-white/95 backdrop-blur-sm p-8 rounded-2xl text-center border border-gray-200/40 shadow-2xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">驗證管理員權限中...</p>
        </div>
      </div>
    );
  }

  // 未登入狀態
  if (!isAuthenticated) {
    return (
      <div className="relative flex justify-center items-center min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-slate-900"></div>
        <div className="relative bg-white/95 backdrop-blur-sm p-8 rounded-2xl text-center border border-gray-200/40 shadow-2xl max-w-md">
          <div className="w-16 h-16 bg-green-700 rounded-full mx-auto mb-4 flex items-center justify-center">
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="w-8 h-8 text-white"
            />
          </div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            需要登入
          </h1>
          <p className="text-gray-600 mb-6">請先登入系統才能存取管理員面板</p>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-lg transition-colors cursor-pointer"
          >
            前往登入頁面
          </button>
        </div>
      </div>
    );
  }

  // 非管理員狀態
  if (!isAdmin) {
    return (
      <div className="relative flex justify-center items-center min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-slate-900"></div>
        <div className="relative bg-white/95 backdrop-blur-sm p-8 rounded-2xl text-center border border-gray-200/40 shadow-2xl max-w-md">
          <div className="w-16 h-16 bg-green-700 rounded-full mx-auto mb-4 flex items-center justify-center">
            <FontAwesomeIcon icon={faTimes} className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            存取被拒
          </h1>
          <p className="text-gray-600 mb-6">您沒有管理員權限，無法存取此頁面</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
              回到主頁
            </button>
            <button
              onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
              }
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
              登出
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <AdminLayout>{children}</AdminLayout>;
};

export default AdminAuthWrapper;
