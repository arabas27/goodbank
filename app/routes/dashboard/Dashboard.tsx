import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { apiURL } from "../../conf";

type Data = {
  seat: number;
  stdid: number;
  title: string;
  fname: string;
  lname: string;
  total: string;
};

export default function Dashboard() {
  const [level, setLevel] = useState("1");
  const [room, setRoom] = useState("1");
  const [data, setData] = useState<Data[]>([]);
  // init และอัพเดต
  useEffect(() => {
    // loading element
    Swal.fire({
      title: "Loading...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    // fetch data
    fetch(
      `${apiURL}/read/get-data-dashboard.php?level=${level}&room=${room}`
    ).then(async (_d) => {
      const { state, data } = await _d.json();

      if (state === 200) {
        setData(data);
        Swal.close();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "เกิดข้อผิดพลาด",
        });
      }
    });
  }, [level, room]);

  return (
    <div className="space-y-6 max-w-md mx-auto">
      {/* filter room */}
      <div className="flex flex-col gap-4 bg-white rounded p-4">
        <label className="flex flex-col">
          เลือกชั้น
          <select
            value={level}
            onChange={(event) => setLevel(event.target.value)}
            className="p-2 border rounded"
          >
            {[...Array(6).keys()].map((val) => (
              <option value={val + 1} key={val}>
                ม.{val + 1}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col">
          เลือกห้อง
          <select
            value={room}
            onChange={(event) => setRoom(event.target.value)}
            className="p-2 border rounded"
          >
            {[...Array(8).keys()].map((val) => (
              <option value={val + 1} key={val}>
                {val + 1}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                เลขที่
              </th>
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
                ชื่อ-นามสกุล
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
            {data.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.seat}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.stdid}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {`${item.title}${item.fname} ${item.lname}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {100 + parseInt(item.total) > 0 ? (
                    <span style={{ color: "green" }}>
                      {100 + parseInt(item.total)}
                    </span>
                  ) : 100 + parseInt(item.total) < 0 ? (
                    <span style={{ color: "red" }}>
                      {100 + parseInt(item.total)}
                    </span>
                  ) : (
                    <span style={{ color: "green" }}>
                      {item.total === null && 100}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
