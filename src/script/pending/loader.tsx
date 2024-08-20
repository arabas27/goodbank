import axios, { AxiosResponse } from "axios";
import { APIBasePath } from "../../script/config.json";
import { defer } from "react-router-dom";

export const loader = async ({ request }: { request: Request }) => {
  const params = new URL(request.url).searchParams;
  const limit = params.get("limit")?.toString() || "20";
  const page = params.get("page")?.toString() || "1";
  const response: AxiosResponse = await axios({
    method: "get",
    url: `${APIBasePath}/getPendingReport.php?limit=${limit}&page=${page}`,
  })
    .then((response) => {
      response.data.limit = limit;
      response.data.page = page;
      return response.data;
    })
    .catch((error) => console.log(error));

  return defer({ response: response });
};
