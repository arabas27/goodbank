import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { Form } from "react-router";
import Swal from "sweetalert2";
import { apiURL } from "../conf";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [_, setCookies] = useCookies(["gbv1-auth"]);

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    fetch(`${apiURL}/read/login.php`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        const { state } = data;
        if (state == 200) {
          // Show success message using SweetAlert
          const { user } = data;
          delete user.password;
          delete user.managecar_auth;
          delete user.status;
          delete user.edit_at;

          setCookies("gbv1-auth", user);
          Swal.fire({
            title: "Login Successful!",
            text: "คุณได้เข้าสู่ระบบอย่างสำเร็จแล้ว",
            icon: "success",
            confirmButtonText: "OK",
          });
        } else if (state == 401) {
          // not match
          Swal.fire({
            title: "Password Not Match!",
            text: "รหัสผ่านที่คุณกรอกไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง",
            icon: "error",
            confirmButtonText: "OK",
          });
        } else if (state == 404) {
          Swal.fire({
            title: "User Not Found!",
            text: "ชื่อผู้ใช้งานที่คุณกรอกไม่มีในระบบ กรุณาตรวจสอบและลองใหม่อีกครั้ง",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      })
      .catch((error) => {
        console.error("Error during login:", error);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 ps-3">
      <h1 className="text-4xl font-bold bg-blue-600 text-white px-5 py-3 rounded-lg mb-8">
        ธนาคารความดี
      </h1>
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center">เข้าใช้งานระบบ</h2>
        <Form onSubmit={handleLogin} autoComplete="off" className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="username"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="flex items-center w-full border rounded-lg focus:outline-none focus-within:ring-2 focus-within:ring-blue-500">
              <input
                type={isShowPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="px-4 py-2 w-full outline-0"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setIsShowPassword(!isShowPassword)}
                className="text-gray-600 hover:text-gray-900 focus:outline-none px-3"
              >
                {isShowPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Login
          </button>
        </Form>
      </div>
    </div>
  );
}
