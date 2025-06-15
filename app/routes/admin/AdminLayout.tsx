import { Outlet } from "react-router";
import { CookiesProvider } from "react-cookie";
import { cookiePath } from "../../conf";
import Navigation from "./components/Navigation";
import AdminProtectedRoute from "../protectedRoute/AdminProtectedRoute";

export default function Mainlayout() {
  return (
    <CookiesProvider
      defaultSetOptions={{
        path: cookiePath,
        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      }}
    >
      <AdminProtectedRoute>
        <div className="min-h-screen bg-gray-100">
          <Navigation />
          <main className="max-w-7xl mx-auto p-6">
            <Outlet />
          </main>
        </div>
      </AdminProtectedRoute>
    </CookiesProvider>
  );
}
