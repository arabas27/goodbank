import { createContext, useCallback, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAPI } from "./useAPI";

export type TCreateContextProps = {
  user: string | null;
  login: (data: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<TCreateContextProps>({
  user: null,
  login: async () => {},
  logout: () => {},
});

type TAuthProviderProps = {
  children: React.ReactElement;
};

export const AuthProvider: React.FC<TAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useAPI("user", null);
  const navigate = useNavigate();

  // call this function when you want to authenticate the user
  const login = useCallback(
    async (data: string) => {
      await setUser(data);
      user && navigate("/", { replace: true });
    },
    [user, setUser, navigate]
  );

  // call this function to sign out logged in user
  const logout = useCallback(async () => {
    await setUser(null);
    navigate("/login", { replace: true });
  }, [setUser, navigate]);

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [login, logout, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
