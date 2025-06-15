import { useEffect, useState } from "react";
import TypeButton from "./components/TypeButton";
import StudentCard from "./components/StudentCard";
import { apiURL } from "../../conf";
import Swal from "sweetalert2";
import { useCookies } from "react-cookie";

type Students = {
  stdid: number;
  title: string;
  fname: string;
  lname: string;
  seat: number;
};

export default function RecordBehavior() {
  const [level, setLevel] = useState("1");
  const [section, setSection] = useState("1");
  // 1 = increase, 2 = decrease
  const [behaviorType, setBehaviorType] = useState(1);
  const [students, setStudents] = useState<Students[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [detail, setDetail] = useState("");
  const [score, setScore] = useState<string>("5");
  const [cookies] = useCookies(["gbv1-auth"]);

  // load students data when level or section changed
  useEffect(() => {
    (() => {
      try {
        Swal.fire({
          didOpen: () => {
            Swal.showLoading();
          },
        });

        fetch(
          `${apiURL}/read/get-students-by-classroom.php?level=${level}&section=${section}`
        ).then(async (d) => {
          const { state, data } = await d.json();
          Swal.close();
          if (state === 200) {
            setStudents(data);
          } else {
            Swal.fire({
              title: "ผิดพลาด",
              text: "โหลดข้อมูลผิดพลาด",
              icon: "error",
            });
          }
        });
      } catch (error) {
        console.log(error);
      }
    })();
  }, [level, section]);

  const addSelectedStudents = (stdid: number) => {
    setSelectedStudents((prev) => {
      if (prev.includes(stdid)) {
        return prev.filter((val) => val !== stdid);
      } else {
        return [...prev, stdid];
      }
    });
  };
  const handleRecord = () => {
    // verify data
    // check selected students
    if (selectedStudents.length == 0) {
      Swal.fire({
        title: "คำเตือน",
        text: "กรุณาเลือกนักเรียนที่ต้องการบันทึกพฤติกรรม",
        icon: "warning",
        confirmButtonText: "ยืนยัน",
      });
      return;
    }

    // check detail
    if (detail.trim() === "") {
      Swal.fire({
        title: "คำเตือน",
        text: "กรุณากรอกรายละเอียดพฤติกรรม",
        icon: "warning",
        confirmButtonText: "ยืนยัน",
      });
      return;
    }

    // check score
    if (parseInt(score) < 0 || !score) {
      Swal.fire({
        title: "คำเตือน",
        text: "กรุณากรอกคะแนนพฤติกรรมที่ 0 หรือมากกว่า 0",
        icon: "warning",
        confirmButtonText: "ยืนยัน",
      });
      return;
    }

    // create fromData
    const formData = new FormData();

    formData.append("selected_students", JSON.stringify(selectedStudents));
    formData.append("level", level);
    formData.append("section", section);
    formData.append("type", behaviorType.toString());
    formData.append("detail", detail);
    formData.append("score", score);
    formData.append("username", cookies["gbv1-auth"].username);

    // send data to API
    fetch(`${apiURL}/create/record-behavior.php`, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.state === 200) {
          Swal.fire({
            title: "สำเร็จ",
            text: "บันทึกพฤติกรรมเสร็จสิ้น",
            icon: "success",
          });
          // reset form
          setSelectedStudents([]);
          setDetail("");
          setScore("5");
        } else {
          Swal.fire({
            title: "ผิดพลาด",
            text: "เกิดข้อผิดพลาดในการบันทึกพฤติกรรม",
            icon: "error",
          });
        }
      })
      .catch((err) => {
        console.error(err);
        Swal.fire({
          title: "ผิดพลาด",
          text: "เกิดข้อผิดพลาดในการบันทึกพฤติกรรม",
          icon: "error",
        });
      });
  };

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          บันทึกพฤติกรรมนักเรียน
        </h2>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                เลือกชั้นเรียน
              </label>
              <select
                value={level}
                onChange={(evt) => setLevel(evt.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {[
                  { value: "1", name: "ม.1" },
                  { value: "2", name: "ม.2" },
                  { value: "3", name: "ม.3" },
                  { value: "4", name: "ม.4" },
                  { value: "5", name: "ม.5" },
                  { value: "6", name: "ม.6" },
                ].map((el, i) => (
                  <option key={i} value={el.value}>
                    {el.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                เลือกห้อง
              </label>
              <select
                value={section}
                onChange={(evt) => setSection(evt.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {[...Array(8).keys()].map((val, i) => (
                  <option key={i} value={val + 1}>
                    {val + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              เลือกนักเรียน
            </label>
            <div className="grid grid-cols-1 gap-3">
              {students.length > 0 &&
                students.map((el, i) => (
                  <StudentCard
                    key={i}
                    seatNumber={el.seat}
                    stdid={el.stdid}
                    title={el.title}
                    fname={el.fname}
                    lname={el.lname}
                    className={
                      selectedStudents.includes(el.stdid)
                        ? "border border-blue-500 text-blue-800 bg-blue-100"
                        : "border border-gray-400"
                    }
                    onClick={() => addSelectedStudents(el.stdid)}
                  />
                ))}

              {students.length === 0 && <div>- ไม่พบข้อมูล -</div>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              เลือกประเภท
            </label>
            <div className="flex gap-3">
              <TypeButton
                texts="เพิ่ม"
                onClick={() => setBehaviorType(1)}
                className={
                  behaviorType === 1
                    ? `bg-green-300 border border-green-700`
                    : `bg-gray-200 border border-gray-700`
                }
              />
              <TypeButton
                texts="ลด"
                onClick={() => setBehaviorType(-1)}
                className={
                  behaviorType === -1
                    ? `bg-red-300 border border-red-700`
                    : `bg-gray-200 border border-gray-700`
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              รายละเอียด
            </label>
            <textarea
              value={detail}
              onChange={(evt) => setDetail(evt.target.value)}
              rows={3}
              placeholder="รายละเอียดพฤติกรรม..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              คะแนน
            </label>
            <input
              type="number"
              value={score}
              onChange={(evt) => setScore(evt.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="button"
            onClick={handleRecord}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            บันทึกข้อมูล
          </button>
        </div>
      </div>
    </div>
  );
}
