import Navbar from "@/ui/navbar";
import { useEffect, useState } from "react";
import {
  Form,
  useActionData,
  useLoaderData,
  useSubmit,
} from "react-router-dom";

type TDummy = {
  [key: string]: string;
};

type TData = {
  authen_level: number;
  firstname: string;
  id: number;
  lastname: string;
  password: string;
  status?: string;
  title: string;
  username: string;
};

export default function Member() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const [message, setMessage] = useState("");
  let { data } = loaderData as { data: TData[] };
  data = data.filter((element) => element.status === "work");
  data.sort((a, b) => b.id - a.id);
  const submit = useSubmit();

  useEffect(() => {
    if (actionData) setMessage("บันทึกสำเร็จ");
  }, [actionData]);

  const [teacherData, setTeacherData] = useState<TData>({
    id: 0,
    authen_level: 2,
    title: "นาง",
    firstname: "",
    lastname: "",
    username: `ws${(parseInt(data[0].username.replace(/ws|std/, "")) + 1)
      .toString()
      .padStart(5, "0")}`,
    password: "1234",
  });
  //   console.log(teacherData);
  const [error, setError] = useState({
    title: "",
    firstname: "",
    lastname: "",
    username: "",
    password: "",
  });

  //   console.log(data);

  const textInputClass = "border border-gray-500 w-full px-3 py-1 rounded";

  //   console.log(teacherData);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    if (formData.get("action") === "save") {
      const dummy: TDummy = {};
      let checker = 0;

      for (const [key, value] of Object.entries(teacherData)) {
        if (key === "password") {
          if (value.toString().length < 4) {
            checker = 1;
            dummy[key] = "พาสเวิร์ดไม่น้อยกว่า 4 ตัวอักษร";
          }
        } else if (value === "") {
          checker = 1;
          dummy[key] = "*จำเป็น";
        }
      }
      // console.log(checker);
      setError({ ...error, ...dummy });
      // block submit if error
      if (checker === 1) return;

      formData.append("id", teacherData.id.toString());
      formData.append("title", teacherData.title);
      formData.append("firstname", teacherData.firstname);
      formData.append("lastname", teacherData.lastname);
      formData.append("authen_level", teacherData.authen_level.toString());
      formData.append("username", teacherData.username);
      formData.append("password", teacherData.password);
    } else if (formData.get("action") === "delete") {
      const isDeleted = confirm(
        `ต้องการลบรายการ ${formData.get("fullname")} ไหม?`
      );

      if (!isDeleted) return;
    }

    submit(formData, {
      method: "POST",
    });
  };

  const Items = ({
    value,
    index,
  }: {
    value: {
      id: number;
      firstname: string;
      lastname: string;
      username: string;
    };
    index: number;
  }) => {
    return (
      <div className="flex flex-row">
        <div
          className="w-2/12"
          onClick={() =>
            setTeacherData(data.filter((el) => el.id === value.id)[0])
          }
        >
          <div className="text-blue-500 font-bold">เลือก</div>
        </div>
        <div className="w-1/12">{index + 1}</div>
        <div className="w-5/12">{`${value.firstname} ${value.lastname}`}</div>
        <div className="w-3/12">{value.username}</div>
        <Form className="w-1/12" onClick={handleSubmit}>
          <input
            className="hidden"
            type="text"
            name="action"
            defaultValue="delete"
          />
          <input
            className="hidden"
            type="text"
            name="id"
            defaultValue={value.id}
          />
          <input
            className="hidden"
            type="text"
            name="fullname"
            defaultValue={`${value.firstname} ${value.lastname}`}
          />
          <div className="text-red-500 font-bold">ลบ</div>
        </Form>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <Navbar />
      {/* edit box */}
      <div className="relative mt-3">
        <h3 className="absolute left-6 -top-1 border border-gray-500 px-3 py-2 bg-blue-100 rounded text-xl font-bold">
          บริหารสมาชิก
        </h3>
      </div>

      <div className="bg-gray-100 px-3 pt-6 pb-1 mt-3">
        <div className="flex flex-col bg-white p-3 gap-2 grow">
          <div className="flex flex-row gap-3 w-full">
            <div className="flex flex-col w-full">
              <label htmlFor="authen_level">ตำแหน่ง</label>
              <select
                className={textInputClass}
                name="authen_level"
                id="authen_level"
                value={teacherData.authen_level}
                onChange={(e) => {
                  setTeacherData({
                    ...teacherData,
                    authen_level: parseInt(e.currentTarget.value),
                  });
                  setMessage("");
                }}
              >
                <option value="2">ครู</option>
                <option value="3">ผู้บริหาร</option>
                <option value="4">แอดมินระบบ</option>
              </select>
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="title">คำนำหน้า</label>
              <input
                className={textInputClass}
                type="text"
                name="title"
                id="title"
                autoComplete="off"
                value={teacherData.title}
                onChange={(e) => {
                  setTeacherData({
                    ...teacherData,
                    title: e.currentTarget.value,
                  });
                  setError({ ...error, title: "" });
                  setMessage("");
                }}
              />
              <div className="text-red-600 text-sm">{error.title}</div>
            </div>
          </div>
          <div className="flex flex-row gap-3">
            <div className="flex flex-col w-full">
              <label htmlFor="firstname">ชื่อ</label>
              <input
                className={textInputClass}
                type="text"
                name="firstname"
                id="firstname"
                autoComplete="off"
                value={teacherData.firstname}
                onChange={(e) => {
                  setTeacherData({
                    ...teacherData,
                    firstname: e.currentTarget.value,
                  });
                  setError({ ...error, firstname: "" });
                  setMessage("");
                }}
              />
              <div className="text-red-600 text-sm">{error.firstname}</div>
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="lastname">นามสกุล</label>
              <input
                className={textInputClass}
                type="text"
                name="lastname"
                id="lastname"
                autoComplete="off"
                value={teacherData.lastname}
                onChange={(e) => {
                  setTeacherData({
                    ...teacherData,
                    lastname: e.currentTarget.value,
                  });
                  setError({ ...error, lastname: "" });
                  setMessage("");
                }}
              />
              <div className="text-red-600 text-sm">{error.lastname}</div>
            </div>
          </div>
          <div className="flex flex-row gap-3">
            <div className="flex flex-col w-full">
              <label htmlFor="username">username</label>
              <input
                className={textInputClass}
                type="text"
                name="username"
                id="username"
                autoComplete="off"
                value={teacherData.username}
                onChange={(e) => {
                  setTeacherData({
                    ...teacherData,
                    username: e.currentTarget.value,
                  });
                  setError({ ...error, username: "" });
                  setMessage("");
                }}
              />
              <div className="text-red-600 text-sm">{error.username}</div>
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="password">password</label>
              <input
                className={textInputClass}
                type="text"
                name="password"
                id="password"
                autoComplete="off"
                value={teacherData.password}
                onChange={(e) => {
                  setTeacherData({
                    ...teacherData,
                    password: e.currentTarget.value,
                  });
                  setError({ ...error, password: "" });
                  setMessage("");
                }}
              />
              <div className="text-red-600 text-sm">{error.password}</div>
            </div>
          </div>
          <div className="flex flex-row gap-3">
            <div className="w-full">
              <button
                className="bg-gray-500 py-1 text-lg font-bold text-white rounded w-full"
                onClick={() => {
                  window.location.reload();
                  window.location.replace("./member");
                }}
              >
                ล้าง
              </button>
            </div>
            <Form className="w-full" onSubmit={handleSubmit}>
              <input
                className="hidden"
                type="text"
                name="action"
                defaultValue="save"
              />
              <button className="bg-blue-500 py-1 text-lg font-bold text-white rounded w-full">
                บันทึก
              </button>
            </Form>
          </div>
          <div className="text-green-600">{message}</div>
        </div>
      </div>

      <div className="relative mt-3">
        <h3 className="absolute left-6 -top-1 border border-gray-500 px-3 py-2 bg-blue-100 rounded text-xl font-bold">
          รายชื่อสมาชิก
        </h3>
      </div>

      <div className="bg-gray-100 px-3 pt-6 pb-1 mt-3 text-sm sm:text-base">
        <div className="flex flex-col bg-white p-3 gap-2 ">
          <div className="flex flex-row font-bold gap-1">
            <div className="w-2/12"></div>
            <div className="w-1/12">ที่</div>
            <div className="w-5/12">ชื่อ-สกุล</div>
            <div className="w-3/12">username</div>
            <div className="w-1/12">ลบ</div>
          </div>
          {data.map((el, index) => (
            <Items value={el} index={index} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
