import axios from "axios";
import { APIBasePath } from "@/script/config.json";

// type TStudentData = {
//   id: number;
//   std_id: string;
//   title: string;
//   firstname: string;
//   lastname: string;
//   seat_no: number;
//   level: number;
//   section: number;
// };

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();

  // const selectedStudent = JSON.parse(
  //   formData.get("selectedStudentID")!.toString()
  // );
  //   const type = formData.get("type");
  //   const doerID = formData.get("doerID");
  // formData.delete("selectedStudentID");

  // const results = Promise.all(
  //   selectedStudent.map(async (studentData: TStudentData) => {
  //     formData.delete("studentData");
  //     formData.append("studentData", JSON.stringify(studentData));
  //     return axios({
  //       method: "post",
  //       url: `${APIBasePath}/createReport.php`,
  //       data: formData,
  //     })
  //       .then((result) => result.data)
  //       .catch((err) => console.log(err));
  //   })
  // )
  const results = await axios({
    method: "post",
    url: `${APIBasePath}/createReport.php`,
    data: formData,
  })
    .then((data) => {
      return data;
    })
    .catch((err) => console.log(err));

  // console.log(results);

  return results;
};
