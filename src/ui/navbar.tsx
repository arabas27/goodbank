import { useAuth } from "@/script/auth/useAuth";
import clsx from "clsx";
import { NavLink } from "react-router-dom";
import {
  BsFillHouseFill,
  BsFillPencilFill,
  BsFillBriefcaseFill,
  BsWrench,
  BsGearFill,
  BsFileEarmarkPersonFill,
  BsFilePerson,
} from "react-icons/bs";

const allNavItems = [
  {
    icon: BsFillPencilFill,
    title: "รายงาน",
    href: "/",
  },
  {
    icon: BsFileEarmarkPersonFill,
    title: "ดูคะแนน",
    href: "/personInfo",
  },
  {
    icon: BsFillHouseFill,
    title: "อันดับ",
    href: "/ranking",
  },
  {
    icon: BsFillBriefcaseFill,
    title: "งานรับ",
    href: "/pending",
  },
  {
    icon: BsWrench,
    title: "แก้ไข",
    href: "/edit",
  },
  {
    icon: BsGearFill,
    title: "ตั้งค่า",
    href: "/setting",
  },
  {
    icon: BsFilePerson,
    title: "สมาชิก",
    href: "/member",
  },
];

export default function Navbar() {
  const { user } = useAuth();
  const u = user as string;
  const userData = JSON.parse(u);

  const navItems =
    userData.authen_level < 3
      ? allNavItems.filter(
          (el) =>
            el.href !== "/pending" &&
            el.href !== "/edit" &&
            el.href !== "/edit" &&
            el.href !== "/member"
        )
      : userData.authen_level < 4
      ? allNavItems.filter((el) => el.href !== "/edit" && el.href !== "/member")
      : allNavItems;

  // console.log(navItems);

  return (
    <>
      <nav className="flex flex-row overflow-x-scroll bg-blue-500 text-white shadow-[0px_5px_5px_-3px] shadow-gray-500">
        {navItems.map((navItem, i) => {
          const LinkIcon = navItem.icon;

          if (navItem.href === null) {
            return null;
          } else {
            return (
              <NavLink
                to={navItem.href}
                className={({ isActive, isPending }) =>
                  clsx(
                    "flex flex-col items-center justify-center px-3 py-2 flex-1",
                    {
                      "border-b-2 bg-blue-400/50": isActive,
                      "border-b-2 border-b-yellow-500": isPending,
                    }
                  )
                }
                key={i}
              >
                <div className="flex flex-col items-center w-10">
                  <LinkIcon className="w-6 h-6" />
                  <span className="mt-2 text-center text-nowrap">
                    {navItem.title}
                  </span>
                </div>
              </NavLink>
            );
          }
        })}
      </nav>
      <div className="flex flex-row items-center justify-end gap-2 px-3">
        <span className="font-bold">ผู้ใช้งาน</span>
        <span className="bg-blue-300 rounded-full px-3 py-1 font-bold">
          {` ${userData.title}${userData.firstname} ${userData.lastname}`}
        </span>
      </div>
    </>
  );
}
