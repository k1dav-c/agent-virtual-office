import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "@components/LoginButton";

const LoginPage = () => {
  const { isAuthenticated } = useAuth0();

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="relative flex justify-center items-center h-screen overflow-hidden">
      {/* 主要背景漸層 */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-25 via-orange-25 to-amber-50"></div>

      {/* 裝飾性圓形元素 */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-amber-200/15 to-orange-200/15 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-orange-200/15 to-red-200/15 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-gradient-to-r from-yellow-200/10 to-amber-200/10 rounded-full blur-2xl"></div>

      {/* 網格圖案背景 */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #fbbf24 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      ></div>

      {/* 微妙的波浪效果 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-amber-25/8 to-transparent"></div>

      {/* 登入卡片 */}
      <div className="relative bg-white/95 backdrop-blur-sm p-12 rounded-2xl text-center max-w-md w-full border border-gray-200 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-white/70 to-amber-25/15 rounded-2xl"></div>
        <div className="relative z-10">
          <h1 className="text-gray-800 mb-4 text-2xl font-semibold">
            Project Template
          </h1>
          <p className="text-gray-600 mb-8">請登入以繼續使用服務</p>
          <LoginButton variant="primary" size="lg">
            登入
          </LoginButton>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
