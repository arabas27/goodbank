import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const [cookies] = useCookies(["gbv1-auth"]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!cookies["gbv1-auth"]) {
      navigate("login");
    }
  }, [cookies["gbv1-auth"]]);

  return children;
}
