import axios, { AxiosResponse } from "axios";
import { APIBasePath } from "../config.json";

export const loader = async ({ request }: { request: Request }) => {
  const params = new URL(request.url).searchParams;
  const level = params.get("level")?.toString() || "1";
  const section = params.get("section")?.toString() || "1";
  const response: AxiosResponse = await axios({
    method: "get",
    url: `${APIBasePath}/getStudentForReportByClass.php?level=${level}&section=${section}`,
  })
    .then((response) => response.data)
    .catch((error) => console.log(error));

  return response;
};
