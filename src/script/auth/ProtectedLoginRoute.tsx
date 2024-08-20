import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";

type ProtectedLoginRouteProps = {
  children: React.ReactElement;
};

export const ProtectedLoginRoute: React.FC<ProtectedLoginRouteProps> = ({
  children,
}) => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" />;
  }
  return children;
};
