import axios, { AxiosResponse } from "axios";
import { APIBasePath } from "../../script/config.json";
import { Params } from "react-router-dom";

export const loader = async ({ params }: { params: Params }) => {
  const stdId = params.stdId?.toString() || "";

  const response: AxiosResponse = await axios({
    method: "get",
    url: `${APIBasePath}/getStudentHistory.php?stdid=${stdId}`,
  })
    .then((response) => response.data)
    .catch((error) => console.log(error));

  return response;
};
