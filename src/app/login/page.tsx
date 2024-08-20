import { useAuth } from "@/script/auth/useAuth";
import { useEffect, useState } from "react";
import { BsKeyFill, BsFilePersonFill } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
// import { useCookies } from "react-cookie";

export default function Login() {
  const { state } = useLocation();
  const [username, setUsername] = useState<string | undefined>("");
  const [password, setPassword] = useState<string | undefined>("");
  const [err, setErr] = useState<string>("");
  const [isPassword, setIsPassword] = useState<boolean>(true);
  const { login } = useAuth();
  const navigate = useNavigate();
  // const [cookies, _, removeCookie] = useCookies();

  // if (cookies.user) removeCookie("user");

  useEffect(() => {
    setUsername(state?.username ? state.username : "");
    setPassword(state?.password ? state.password : "");
    setErr(state?.err ? state.err : "");
  }, [state?.err, state?.username, state?.password]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    // Here you would usually send a request to your backend to authenticate the user
    if (username !== "" && password !== "") {
      // Replace with actual authentication logic
      const data = { username: username, password: password };
      await login(JSON.stringify(data));
    } else {
      navigate("/login", {
        state: {
          err: "username หรือ password ไม่ถูกต้อง",
          username: username,
          password: password,
        },
      });
    }
  };

  return (
    <div className="flex flex-row justify-center h-[60vh] select-none">
      <div className="flex flex-col justify-center items-center h-90vh">
        <form
          className="border rounded w-64  bg-gray-100 shadow shadow-gray-300 p-1"
          autoComplete="off"
          onSubmit={handleLogin}
        >
          <h3 className="my-3 text-xl font-bold px-3">ลงชื่อเข้าระบบ</h3>
          <div className="bg-white p-3">
            <div className="flex flex-col gap-3">
              <div className="flex flex-row">
                <div className="flex flex-col grow">
                  <label htmlFor="username">Username: </label>
                  <div className="flex flex-row-reverse justify-center items-center peer h-10">
                    <input
                      className="peer border-e border-y border-gray-300 focus:border-gray-500 px-3 py-1 w-full h-full rounded-e outline-none"
                      type="text"
                      name="username"
                      id="username"
                      value={username}
                      onChange={(e) => {
                        setErr("");
                        setUsername(e.target.value);
                      }}
                    />
                    <BsFilePersonFill className="h-full w-9 px-1 border-s border-y border-gray-300 peer-focus:border-gray-500 rounded-s" />
                  </div>
                </div>
              </div>
              <div className="flex flex-row">
                <div className="flex flex-col grow">
                  <label htmlFor="password">Password: </label>
                  <div className="flex justify-center items-center peer h-10">
                    <input
                      className="order-2 peer border-y border-gray-300 focus:border-gray-500 px-3 py-1 w-full h-full outline-none"
                      type={isPassword ? "password" : "text"}
                      name="password"
                      id="password"
                      value={password}
                      onChange={(e) => {
                        setErr("");
                        setPassword(e.target.value);
                      }}
                    />
                    <BsKeyFill className="order-1 h-full w-9 px-1 border-s border-y border-gray-300 peer-focus:border-gray-500 rounded-s" />
                    {isPassword ? (
                      <BsEyeFill
                        className="w-9 pe-1 order-3 border-y border-e border-gray-300 peer-focus:border-gray-500 rounded-e h-full"
                        onClick={() => setIsPassword(!isPassword)}
                      />
                    ) : (
                      <BsEyeSlashFill
                        className="w-9 pe-1 order-3 border-y border-e border-gray-300 peer-focus:border-gray-500 rounded-e h-full"
                        onClick={() => setIsPassword(!isPassword)}
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="text-red-500">{err}</div>
              <button
                type="submit"
                className="bg-blue-500 text-white p-1 rounded text-lg font-bold"
              >
                เข้าระบบ
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
