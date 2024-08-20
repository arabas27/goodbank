import axios from "axios";
import { APIBasePath } from "@/script/config.json";
// import { Link } from "react-router-dom";

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  // const stdId = formData.get("stdId");

  const results = await axios({
    method: "post",
    url: `${APIBasePath}/updateReport.php`,
    data: formData,
  })
    .then((data) => {
      return data;
    })
    .catch((err) => console.log(err));

  // console.log(results);

  return results;
};
