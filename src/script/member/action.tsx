import axios from "axios";
import { APIBasePath } from "@/script/config.json";

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const results = await axios({
    method: "post",
    url: `${APIBasePath}/saveTeacher.php`,
    data: formData,
  })
    .then((data) => {
      return data;
    })
    .catch((err) => console.log(err));

  //   console.log(results);

  return results;
};
