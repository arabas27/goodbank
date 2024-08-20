import LogoBar from "@/ui/logo-bar";
import { Outlet } from "react-router-dom";

export default function Root() {
  return (
    <>
      <LogoBar />
      <main>
        <div className="md:w-8/12 lg:w-5/12 xl:w-4/12 mx-auto">
          <Outlet />
        </div>
      </main>
    </>
  );
}
