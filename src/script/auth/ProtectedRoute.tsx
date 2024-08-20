import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { useCookies } from "react-cookie";

type ProtectedRouteProps = {
  children: React.ReactElement;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const [_, __, removeCookie] = useCookies();
  const location = useLocation();
  const navigate = useNavigate();

  let userData;
  try {
    userData = JSON.parse(user as string);
  } catch (error) {
    removeCookie("user", { expires: new Date(200 * 1000), path: "/" });
    removeCookie("user", { expires: new Date(200 * 1000), path: "/goodbank" });
    navigate(0);
    return;
  }

  const { pathname } = location;
  const mainPath = pathname.slice(1).split("/")[0];

  // console.log(pathname.slice(1).split("/"));
  // console.log(userData);

  if (!userData) {
    return <Navigate to="/login" />;
  }

  // limit authentification
  if (userData.authen_level < 3) {
    if (mainPath === "pending") return <Navigate to="/" />;
  }

  if (userData.authen_level < 4) {
    if (mainPath === "edit") return <Navigate to="/" />;
  }

  return children;
};
