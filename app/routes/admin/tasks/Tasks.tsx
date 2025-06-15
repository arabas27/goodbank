import { apiURL } from "../../../conf";
import InfoCard, { type Task } from "./components/InfoCard";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useCookies } from "react-cookie";

export default function Tasks() {
  const [cookies] = useCookies(["gbv1-auth"]);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  // init data
  useEffect(() => {
    Swal.fire({
      title: "Loading...",
      didOpen: () => {
        Swal.showLoading();
      },
    });

    fetch(`${apiURL}/read/get-tasks.php`)
      .then((response) => response.json())
      .then((json) => {
        if (json.state === 200) {
          setData(json.data);
          setTotal(json.total);
        } else {
          Swal.fire({
            title: "Error!",
            text: json.message || "An error occurred while fetching data.",
            icon: "error",
          });
        }
        Swal.close();
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">จำนวนทั้งหมด: {total} รายการ</div>
      {data.length > 0 &&
        data.map((task: Task, i: number) => (
          <InfoCard
            {...{
              ...task,
              user: cookies["gbv1-auth"] ? cookies["gbv1-auth"].username : null,
            }}
            key={i}
          />
        ))}
    </div>
  );
}
