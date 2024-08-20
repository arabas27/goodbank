// import { BsBank2 } from "react-icons/bs";
import { Link } from "react-router-dom";
// import { basePath } from "@/script/config.json";
import { useAuth } from "@/script/auth/useAuth";
import logo from "../assets/book.png";

export default function LogoBar() {
  const { user, logout } = useAuth();
  return (
    <div className="flex flex-row items-center justify-between bg-blue-500 px-6 h-[8vh] text-white">
      <Link to={"/"} className="flex flex-row gap-2 items-center justify-start">
        {/* <BsBank2 className="w-6 h-6" /> */}
        <img src={logo} width={40} height={40} />
        <span className="text-xl font-bold">ธนาคารความดี</span>
      </Link>
      {user && (
        <div
          className="flex flex-col items-center justify-center bg-white rounded"
          onClick={() => logout()}
        >
          <div className="text-blue-500 px-2 py-1 font-bold">ออกระบบ</div>
        </div>
      )}
    </div>
  );
}
