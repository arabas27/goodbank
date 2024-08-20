import axios, { AxiosResponse } from "axios";
import { APIBasePath } from "@/script/config.json";

export const loader = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const level = url.searchParams.get("level");
  const section = url.searchParams.get("section");

  const response: AxiosResponse = await axios({
    method: "get",
    url: `${APIBasePath}/getStudentForReport.php?level=${
      level === null ? "1" : level
    }&section=${section === null ? "1" : section}`,
  })
    .then((response) => response.data)
    .catch((error) => console.log(error));

  return response.data;
};
