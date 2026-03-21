import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
  const { logout } = useAuth0();

  const handleLogout = () => {
    localStorage.clear();
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  return (
    <button
      className="w-full bg-red-50 hover:bg-red-100 active:bg-red-200 text-red-700 hover:text-red-800 active:text-red-900 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      onClick={handleLogout}
    >
      登出
    </button>
  );
};

export default LogoutButton;
