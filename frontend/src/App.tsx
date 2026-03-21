import { useAuth0 } from "@auth0/auth0-react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

import AdminAuthWrapper from "@components/AdminAuthWrapper";
import { useUserSync } from "@hooks/useUserSync";
import "./App.css";
import AdminPage from "./pages/AdminPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";

const UserSyncWrapper = ({ children }: { children: React.ReactNode }) => {
  useUserSync();
  return <>{children}</>;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, isAuthenticated } = useAuth0();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl text-center border border-gray-200/40 shadow-2xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <UserSyncWrapper>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminAuthWrapper>
                  <AdminPage />
                </AdminAuthWrapper>
              </ProtectedRoute>
            }
          />
        </Routes>
      </UserSyncWrapper>
    </Router>
  );
};

export default App;
