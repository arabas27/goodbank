import { CookiesProvider } from "react-cookie";
import { Outlet } from "react-router";
import { cookiePath } from "../conf";
import LoginProtectedRoute from "./protectedRoute/LoginProtectedRoute";

export function meta() {
  return [{ title: "ระบบธนาคารความดี" }];
}

export default function BlankLayout() {
  return (
    <CookiesProvider
      defaultSetOptions={{
        path: cookiePath,
        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      }}
    >
      <LoginProtectedRoute>
        <div>
          <Outlet />
        </div>
      </LoginProtectedRoute>
    </CookiesProvider>
  );
}
