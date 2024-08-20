import axios, { AxiosResponse } from "axios";
import { APIBasePath } from "../../script/config.json";

export const loader = async () => {
  const response: AxiosResponse = await axios({
    method: "get",
    url: `${APIBasePath}/getAllTeachers.php`,
  })
    .then((response) => response.data)
    .catch((error) => console.log(error));

  return response;
};
