import { Outlet } from "react-router";
import PublicNavigation from "./components/PublicNavigation";

export default function PublicLayout() {
  return (
    <div>
      <PublicNavigation />
      <Outlet />
    </div>
  );
}
