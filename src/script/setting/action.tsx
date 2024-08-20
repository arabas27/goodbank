import axios from "axios";
import { APIBasePath } from "@/script/config.json";

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const results = await axios({
    method: "post",
    url: `${APIBasePath}/updatePassword.php`,
    data: formData,
  })
    .then((data) => {
      return data;
    })
    .catch((err) => console.log(err));

  return results;
};
