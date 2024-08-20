import axios, { AxiosResponse } from "axios";
import { APIBasePath } from "@/script/config.json";
import { Params } from "react-router-dom";

export const loader = async ({ params }: { params: Params }) => {
  const response: AxiosResponse = await axios({
    method: "get",
    url: `${APIBasePath}/getStudentAndHistoryForEditing.php?stdId=${params.id}`,
  })
    .then((response) => response.data)
    .catch((error) => console.log(error));

  // console.log(response);

  return response;
};
