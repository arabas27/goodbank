import Navbar from "@/ui/navbar";
import { useEffect, useState } from "react";
import { Form, useActionData, useSubmit } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useAuth } from "@/script/auth/useAuth";

export default function Setting() {
  const [isShowNewPass, setIsShowNewPass] = useState(false);
  const [isShowRecheck, setIsShowRecheck] = useState(false);
  const [newPass, setNewPass] = useState("");
  const [recheck, setRecheck] = useState("");
  const submit = useSubmit();
  const actionData = useActionData() as { data: { status: number } };
  const { user } = useAuth();
  const username = JSON.parse(user as string).username;
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    actionData && actionData.data.status === 200 && setIsCompleted(true);
  }, [actionData]);
  return (
    <div className="flex flex-col gap-3">
      <Navbar />
      <Form
        className="flex flex-col gap-3 p-3 mx-3 mt-5 bg-gray-100 shadow shadow-gray-500"
        method="POST"
        onSubmit={(e) => {
          e.preventDefault();
          console.log(isShowNewPass !== isShowRecheck);
          if (newPass.length < 4) {
            alert("พิมพ์พาสเวิร์ดใหม่ 4 ตัวอักษรขึ้นไป");
            return null;
          }

          if (newPass !== recheck) {
            alert("พาสเวิร์ดใหม่ทั้ง 2 ไม่ตรงกัน");
            return null;
          }
          setNewPass("");
          setRecheck("");
          const formData = new FormData(e.currentTarget);
          formData.append("username", username);

          submit(formData, {
            method: "POST",
          });
        }}
      >
        <div className="relative">
          <h3 className="absolute text-lg font-bold bg-white rounded py-1 px-3 -top-8 -left-1 border border-gray-500">
            เปลี่ยนพาสเวิร์ด
          </h3>
        </div>
        <div className="flex flex-col">
          <label htmlFor="newPassword">พิมพ์พาสเวิร์ดใหม่</label>
          <div className="flex flex-row items-center">
            <input
              className="border-s border-y border-gray-300 w-full py-1 px-3 rounded-s peer outline-gray-500"
              type={isShowNewPass ? "text" : "password"}
              name="newPassword"
              id="newPassword"
              value={newPass}
              onChange={(e) => {
                setIsCompleted(false);
                setNewPass(e.currentTarget.value);
              }}
            />
            <div
              className="border-e border-y border-gray-300 py-1 px-3 rounded-e"
              onClick={() => setIsShowNewPass(!isShowNewPass)}
            >
              {isShowNewPass ? (
                <AiFillEye className="w-6 h-6" />
              ) : (
                <AiFillEyeInvisible className="w-6 h-6" />
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <label htmlFor="recheck">พิมพ์พาสเวิร์ดใหม่อีกครั้ง</label>
          <div className="flex flex-row items-center">
            <input
              className="border-s border-y border-gray-300 w-full py-1 px-3 rounded-s peer outline-gray-500"
              type={isShowRecheck ? "text" : "password"}
              name="recheck"
              id="recheck"
              value={recheck}
              onChange={(e) => setRecheck(e.currentTarget.value)}
            />
            <div
              className="border-e border-y border-gray-300 py-1 px-3 rounded-e"
              onClick={() => {
                setIsCompleted(false);
                setIsShowRecheck(!isShowRecheck);
              }}
            >
              {isShowRecheck ? (
                <AiFillEye className="w-6 h-6" />
              ) : (
                <AiFillEyeInvisible className="w-6 h-6" />
              )}
            </div>
          </div>
        </div>
        {isCompleted && (
          <div className="text-green-600 font-bold">
            เปลี่ยนรหัสผ่านใหม่สำเร็จ
          </div>
        )}
        <button
          className="bg-blue-500 py-1 px-3 rounded text-white font-bold"
          type="submit"
        >
          บันทึก
        </button>
      </Form>
    </div>
  );
}
