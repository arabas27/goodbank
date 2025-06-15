import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { apiURL } from "../../conf";

type Params = {
  stdid: string;
};

type Student = {
  stdid: string;
  title: string;
  fname: string;
  lname: string;
  level: number;
  room: number;
};

type History = {
  id: number;
  case_id: string;
  detail: string;
  score: number;
  type: number;
  edit_at: string;
};

export default function StudentView({ params }: { params: Params }) {
  const { stdid } = params;
  const [histories, setHistories] = useState<History[]>([]);
  const [student, setStudent] = useState<Student | null>(null);
  const [total, setTotal] = useState("100");

  // init
  useEffect(() => {
    Swal.fire({
      title: "Loading...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    fetch(`${apiURL}/read/get-student-info.php?stdid=${stdid}`).then(
      async (_d) => {
        const { state, histories, student, total } = await _d.json();
        if (state === 200) {
          setHistories(histories);
          setTotal(total);
          setStudent(student);
          Swal.close();
        } else {
          // Show error message using Swal
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Failed to fetch student data. Please try again later.",
          });
        }
      }
    );
  }, []);

  return (
    <div className="p-3">
      <div className="p-6 bg-white rounded-lg shadow shadow-gray-500">
        <h2 className="text-xl font-bold mb-4">ข้อมูลนักเรียน</h2>
        <p className="text-gray-700">
          ชื่อ-สกุล:{" "}
          {student && `${student.title}${student.fname} ${student.lname}`}
        </p>
        <p className="text-gray-700">
          รหัสนักเรียน: {student && student.stdid}
        </p>
        <p className="text-gray-700">
          ชั้น: ม.{`${student && student.level}/${student && student.room}`}
        </p>
        <p className="text-gray-700">
          คะแนนรวม:{" "}
          <span
            style={{
              color: 100 + parseInt(total) > 0 ? "green" : "red",
              fontWeight: "bold",
            }}
          >
            {100 + parseInt(total)}
          </span>
        </p>
      </div>

      {/* table */}
      <div className="overflow-x-auto mt-7">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                รหัส
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                วันที่
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                รายการ
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                คะแนน
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Sample data rows */}
            {histories.length > 0 &&
              histories
                .sort((a, b) => b.id - a.id)
                .map((history, index) => {
                  const hDate = new Date(history.edit_at);
                  const score = history.score * history.type;

                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {history.case_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {`${hDate.getDate().toString().padStart(2, "0")}/${(
                          hDate.getMonth() + 1
                        )
                          .toString()
                          .padStart(2, "0")}/${hDate.getFullYear() + 543}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {history.detail}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span
                          style={{
                            color: score < 0 ? "red" : "green",
                            fontWeight: "bold",
                          }}
                        >
                          {score}
                        </span>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
