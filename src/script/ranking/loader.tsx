import axios from "axios";
import { APIBasePath } from "../config.json";
import { defer } from "react-router-dom";

export const loader = async ({ request }: { request: Request }) => {
  const params = new URL(request.url).searchParams;
  const filter = params.get("filter") || "ASC";
  const limit = params.get("limit") || "50";
  const response = axios({
    method: "get",
    url: `${APIBasePath}/getStudentRank.php?filter=${filter}&limit=${limit}`,
  })
    .then((response) => {
      // console.log(response);
      return response.data;
    })
    .catch((error) => console.log(error));

  // console.log(response);

  return defer({
    response: response,
  });
};
