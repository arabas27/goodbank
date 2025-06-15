import clsx from "clsx";
import { useState } from "react";
import { Form } from "react-router";
import Swal from "sweetalert2";
import { twMerge } from "tailwind-merge";
import { apiURL, thaiMonths } from "../../../../conf";

export type Task = {
  id: number;
  title: string;
  fname: string;
  lname: string;
  level: number;
  section: number;
  detail: string;
  academic_year: string;
  score: number;
  type: number;
  edit_at: string;
  user: string;
};

export default function InfoCard(task: Task) {
  const [type, setType] = useState(task.type === -1 ? task.type : 1);
  const [score, setScore] = useState(task.score.toString());
  const date = new Date(task.edit_at);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("type", type.toString());
    formData.append("score", score);
    formData.append("std_id", task.id.toString()); // Assuming 'id' is the student ID
    formData.append("id", task.id.toString()); // Assuming 'id' is the task ID
    formData.append("recorder", task.user);

    fetch(`${apiURL}/update/update-task.php`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        const { state } = data;
        if (state === 200) {
          // Fire Swal success
          Swal.fire({
            title: "Success!",
            text: "Task updated successfully.",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            location.reload();
          });
        } else {
          Swal.fire({
            title: "Error!",
            text: "Failed to update task.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <Form
      onSubmit={handleSubmit}
      autoComplete="off"
      className="bg-white p-4 rounded-lg shadow-md mb-4"
    >
      <p className="text-sm text-gray-600">
        {`${date.getDate()} ${thaiMonths[date.getMonth()]} ${
          date.getFullYear() + 543
        }`}
      </p>
      {/* <p className="text-sm text-gray-600">{task.std_id}</p> */}
      <p className="text-sm ">
        {`${task.title}${task.fname} ${task.lname} ม.${task.level}/${task.section}`}
      </p>
      <p className="text-sm text-gray-600">ปีการศึกษา: {task.academic_year}</p>
      <p className="text-sm">{task.detail}</p>
      <div className="flex justify-between space-x-2 mt-3">
        <div className="flex gap-3">
          <input
            type="number"
            value={score}
            onChange={(event) => {
              const value = event.target.value;
              setScore(value);
            }}
            onClick={(event: React.MouseEvent<HTMLInputElement>) =>
              event.currentTarget.select()
            }
            className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-24"
            placeholder="คะแนน"
          />
          <button
            type="button"
            onClick={() => setType(type === -1 ? 1 : -1)}
            className={twMerge(
              clsx(
                `px-3 py-1 text-white font-bold rounded transition duration-200 cursor-pointer`,
                {
                  "bg-green-500 hover:bg-green-600": type === 1,
                  "bg-red-500 hover:bg-red-600": type === -1,
                }
              )
            )}
          >
            {type === -1 ? "ลด" : "เพิ่ม"}
          </button>
        </div>
        <button
          type="submit"
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200 cursor-pointer"
        >
          อนุมัติ
        </button>
      </div>
    </Form>
  );
}
