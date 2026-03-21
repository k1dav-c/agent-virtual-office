import { useAuth0 } from "@auth0/auth0-react";
import Button, { ButtonProps } from "@components/ui/Button";
import React from "react";

interface LoginButtonProps extends Omit<ButtonProps, "onClick" | "children"> {
  children?: React.ReactNode;
}

const LoginButton: React.FC<LoginButtonProps> = ({ children, ...props }) => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Button onClick={() => loginWithRedirect()} {...props}>
      {children || "Log In"}
    </Button>
  );
};

export default LoginButton;
