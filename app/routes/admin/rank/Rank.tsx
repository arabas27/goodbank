import { TrendingUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { apiURL } from "../../../conf";

type Student = {
  title: string;
  fname: string;
  lname: string;
  level: number;
  room: number;
  total: string;
};

export default function Rank() {
  const [selectedType, setSelectedType] = useState(0);
  const [displayLimit, setDisplayLimit] = useState(10);
  const [data, setData] = useState<Student[]>([]);
  const types = ["น้อยสุด", "มากสุด"];

  // init data
  useEffect(() => {
    Swal.fire({
      title: "Loading...",
      didOpen: () => {
        Swal.showLoading();
      },
    });

    fetch(`${apiURL}/read/get-rank.php?t=${selectedType}&l=${displayLimit}`)
      .then(async (response) => await response.json())
      .then((_d) => {
        // check state
        if (_d.state == 200) {
          setData(_d.data);
          Swal.close();
        } else {
          Swal.fire({
            title: "Error",
            icon: "error",
            didOpen: () => {
              Swal.hideLoading();
            },
          });
        }
      })
      .catch((err) => console.log(err));
  }, [selectedType, displayLimit]);

  const getScoreColor = (score: number) => {
    if (score >= 100) return "text-green-600 bg-green-50";
    if (score > 0) return "text-orange-600 bg-orange-50";
    if (score < 0) return "text-red-600 bg-red-50";
    // if (score >= 80) return "text-orange-600 bg-orange-50";
    return "text-gray-600 bg-gray-50";
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank <= 3)
      return "bg-gradient-to-r from-yellow-400 to-orange-500 text-white";
    if (rank <= 5)
      return "bg-gradient-to-r from-blue-400 to-purple-500 text-white";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">อันดับคะแนน</h1>
          </div>
        </div>

        {/* Subject Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {types.map((type, i) => (
              <button
                key={i}
                onClick={() => setSelectedType(i)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedType === i
                    ? "bg-blue-600 text-white shadow-lg transform scale-105"
                    : "bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 shadow-sm"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* limit */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <label
              htmlFor="displayLimit"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              จำนวนแสดง
            </label>
            <div className="flex items-center space-x-2">
              <select
                name="number"
                id="displayLimit"
                value={displayLimit}
                onChange={(evt: React.ChangeEvent<HTMLSelectElement>) =>
                  setDisplayLimit(parseInt(evt.target.value))
                }
                className="w-20 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {[10, 20, 30, 50, 100, 200, 500, 1000, 2000].map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>
              <span className="text-sm text-gray-500">อันดับ</span>
            </div>
          </div>
        </div>

        {/* Full Rankings Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    อันดับ
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    ชื่อ-สกุล
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    ชั้น
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    คะแนน
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.length > 0 &&
                  data.map((student, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${getRankBadgeColor(
                              index + 1
                            )}`}
                          >
                            {index + 1}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">
                            {`${student.title}${student.fname} ${student.lname}`}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">
                            {`ม.${student.level}/${student.room}`}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(
                            100 + parseInt(student.total)
                          )}`}
                        >
                          {100 + parseInt(student.total)}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
