import { LayoutList, ListOrdered, Undo2 } from "lucide-react";
import { useCookies } from "react-cookie";
import { NavLink } from "react-router";

export default function Navigation() {
  const [cookies, __, removeCookies] = useCookies(["gbv1-auth"]);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">ธนาคารความดี</h1>
        <div className="flex items-center justify-center md:justify-start md:ms-5 space-x-1 w-full">
          {[
            { id: 1, label: "งาน", link: "admin/task", icon: LayoutList },
            {
              id: 2,
              label: "อันดับ",
              link: "admin/rank",
              icon: ListOrdered,
            },
            { id: 4, label: "ผู้ใช้", link: "/", icon: Undo2 },
          ].map(({ id, label, link, icon: Icon }) => (
            <NavLink
              key={id}
              to={link}
              className={({ isActive }) => {
                return `px-4 py-2 rounded-lg flex items-center md:space-x-2 transition-colors ${
                  isActive ? "bg-blue-100 text-blue-700" : "text-gray-600"
                } hover:bg-gray-100`;
              }}
            >
              <Icon size={18} />
              <span className="hidden md:block font-medium">{label}</span>
            </NavLink>
          ))}
        </div>
        <div className="flex items-center justify-center md:justify-end w-full">
          <button
            onClick={() => {
              // Perform logout action here, e.g., clear token or redirect to login page
              removeCookies("gbv1-auth");
            }}
            className="px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors cursor-pointer"
          >
            ออกจากระบบ
          </button>
        </div>
      </div>

      <div className="mt-3">
        ผู้ใช้งาน:{" "}
        {`${cookies["gbv1-auth"] && cookies["gbv1-auth"].title}${
          cookies["gbv1-auth"] && cookies["gbv1-auth"].fname
        } ${cookies["gbv1-auth"] && cookies["gbv1-auth"].lname}`}
      </div>
    </nav>
  );
}
