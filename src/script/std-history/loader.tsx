import axios, { AxiosResponse } from "axios";
import { APIBasePath } from "../../script/config.json";
import { Params } from "react-router-dom";

export const loader = async ({ params }: { params: Params }) => {
  const stdid = params.stdid?.toString() || "";

  const response: AxiosResponse = await axios({
    method: "get",
    url: `${APIBasePath}/getStudentHistoryE.php?stdid=${stdid}`,
  })
    .then((response) => response.data)
    .catch((error) => console.log(error));

  return response;
};
