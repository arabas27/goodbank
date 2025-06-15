import { Outlet } from "react-router";
import Navigation from "./main-component/Navigation";
import ProtectedRoute from "./protectedRoute/ProtectedRoute";
import { CookiesProvider } from "react-cookie";
import { cookiePath } from "../conf";

export default function Mainlayout() {
  return (
    <CookiesProvider
      defaultSetOptions={{
        path: cookiePath,
        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      }}
    >
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-100">
          <Navigation />
          <main className="max-w-7xl mx-auto p-6">
            <Outlet />
          </main>
        </div>
      </ProtectedRoute>
    </CookiesProvider>
  );
}
