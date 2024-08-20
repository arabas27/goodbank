import Loading from "@/ui/Loading";
import Navbar from "@/ui/navbar";
import { Suspense } from "react";
import { BsSearch } from "react-icons/bs";
import {
  Await,
  Form,
  useLoaderData,
  useNavigate,
  useNavigation,
  useSearchParams,
} from "react-router-dom";

const Filter = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const filter = params.get("filter") || "ASC";
  const limit = parseInt(params.get("limit") as string) || 50;

  return (
    <Form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        navigate(
          `./?filter=${formData.get("filter")}&limit=${formData.get("limit")}`
        );
      }}
    >
      <div className="flex flex-col">
        <label htmlFor="filter">ตัวกรอง</label>
        <select
          className="px-3 py-1 border  border-gray-500 rounded"
          defaultValue={filter}
          name="filter"
          id="filter"
        >
          <option value={"DESC"}>ผลรวมคะแนนมากไปหาน้อย</option>
          <option value={"ASC"}>ผลรวมคะแนนน้อยไปหามาก</option>
        </select>
      </div>
      <div className="flex flex-col">
        <div className="flex flex-row items-center border border-gray-500 rounded text-nowrap">
          <div className="px-3 py-1 rounded-s">จำนวนแสดง</div>
          <input
            className="px-3 py-1 text-end border-x border-gray-500 focus:outline focus:outline-2 w-full"
            type="number"
            name="limit"
            id="limit"
            defaultValue={limit}
            onClick={(e) => e.currentTarget.select()}
          />
          <div className="px-3 py-1 rounded-e">รายการ</div>
        </div>
      </div>
      <button
        type="submit"
        className="bg-blue-500 px-3 py-1 rounded text-white font-bold"
      >
        <div className="flex flex-row gap-3 items-center justify-center">
          <BsSearch className="w-5 h-5" />
          <span>ค้นหา</span>
        </div>
      </button>
    </Form>
  );
};

// type TStudentCase = {
//   stdId: string;
//   children: TValue[];
// };

// type TValue = {
//   title: string;
//   firstname: string;
//   lastname: string;
//   level: number;
//   section: number;
//   total: number;
// };

type TCase = {
  stdId: string;
  total: number;
  title?: string;
  firstname?: string;
  lastname?: string;
  level?: number;
  section?: number;
};

type TLoaderData = {
  response: {
    allReport: TAllReport[];
    allStd: TAllStd[];
  };
};

type TAllReport = {
  std_id: string;
  type: string;
  score: string;
  create_at: string;
  step: string;
  process_status: string;
};

type TAllStd = {
  title: string;
  firstname: string;
  lastname: string;
  level: number;
  section: number;
  std_id: string;
};

export default function Ranking() {
  const loaderData = useLoaderData() as TLoaderData;
  const { response } = loaderData;
  const [params] = useSearchParams();
  const filter = params.get("filter") || "ASC";
  const limit = params.get("limit") || "50";
  // check state for filtering loading
  const { state } = useNavigation();
  const isLoading = state === "loading";

  return (
    <div className="flex flex-col gap-3 w-full">
      <Navbar />
      <Suspense fallback={<Loading />}>
        <Await resolve={response}>
          {isLoading ? (
            <Loading />
          ) : (
            (response) => {
              const { allStd }: { allStd: TAllStd[] } = response;
              const { allReport }: { allReport: TAllReport[] } = response;
              const uniqueStdCase: TCase[] = [];

              // filtered m4 score before
              const arrReportIndex: number[] = [];
              allReport.forEach((element, index) => {
                const matchedLevel4Index = allStd.findIndex(
                  (el) => el.std_id === element.std_id
                );

                if (
                  element.step === "99" ||
                  element.process_status === "deleted"
                ) {
                  arrReportIndex.push(index);
                } else {
                  const stdData =
                    matchedLevel4Index !== -1
                      ? allStd[matchedLevel4Index]
                      : null;

                  if (stdData) {
                    const startTime = Date.parse("2024-05-01 00:00:00");
                    const elTime = Date.parse(element.create_at);
                    if (
                      stdData.level.toString() === "4" &&
                      elTime < startTime
                    ) {
                      arrReportIndex.push(index);
                    }
                  }
                }
              });

              arrReportIndex
                .reverse()
                .forEach((value) => allReport.splice(value, 1));

              allReport.forEach((element, index, self) => {
                const uniqueIndex = self.findIndex(
                  (selfValue) => selfValue.std_id === element.std_id
                );
                // if (element.std_id === "26763") console.log(element);
                if (uniqueIndex === index) {
                  uniqueStdCase.push({
                    stdId: element.std_id,
                    total:
                      100 +
                      (element.type === "deduct"
                        ? -1 * parseInt(element.score)
                        : element.type === "add"
                        ? parseInt(element.score)
                        : 0),
                  });
                } else {
                  const matchedIndex = uniqueStdCase.findIndex(
                    (selfValue) => selfValue.stdId === element.std_id
                  );

                  if (element.type === "deduct") {
                    uniqueStdCase[matchedIndex].total +=
                      -1 * parseInt(element.score);
                  } else if (element.type === "add") {
                    uniqueStdCase[matchedIndex].total += parseInt(
                      element.score
                    );
                  } else {
                    uniqueStdCase[matchedIndex].total += 0;
                  }
                }
              });

              allStd.forEach((element) => {
                const matchedIndex: number = uniqueStdCase.findIndex(
                  (selfValue) => selfValue.stdId === element.std_id
                );

                if (matchedIndex !== -1) {
                  uniqueStdCase[matchedIndex].title = element.title;
                  uniqueStdCase[matchedIndex].firstname = element.firstname;
                  uniqueStdCase[matchedIndex].lastname = element.lastname;
                  uniqueStdCase[matchedIndex].level = element.level;
                  uniqueStdCase[matchedIndex].section = element.section;
                }

                if (matchedIndex === -1) {
                  uniqueStdCase.push({
                    stdId: element.std_id,
                    total: 100,
                    title: element.title,
                    firstname: element.firstname,
                    lastname: element.lastname,
                    level: element.level,
                    section: element.section,
                  });
                }
              });

              let filteredData = uniqueStdCase.filter((el) => el.firstname);

              if (filter === "DESC") {
                filteredData.sort((a, b) => b.total - a.total);
              } else if (filter === "ASC") {
                filteredData.sort((a, b) => a.total - b.total);
              }

              filteredData = filteredData.slice(0, parseInt(limit));

              // console.log(filteredData);

              // console.log(filteredData);

              return (
                <>
                  <div className="px-3">
                    <h3 className="text-xl font-bold mb-3">สรุปผล</h3>
                    <div className="p-3 bg-gray-100 rounded">
                      <Filter />
                    </div>
                  </div>
                  <div className="px-3 w-full bg-gray-100 py-1">
                    <table className="w-full bg-white rounded">
                      <thead>
                        <tr>
                          <th className="text-start ps-1">ที่</th>
                          <th className="text-start ps-1">ชื่อ-สกุล</th>
                          <th className="text-start ps-1">ชั้น</th>
                          <th className="text-start ps-1">คะแนน</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.map((value: TCase, i: number) => {
                          const totalScore: number = parseInt(
                            value.total.toString()
                          );
                          return (
                            <tr key={i}>
                              <td className="ps-1">{i + 1}</td>
                              <td className="ps-1">
                                {`${
                                  value.title === "เด็กชาย"
                                    ? "ด.ช."
                                    : value.title === "เด็กหญิง"
                                    ? "ด.ญ."
                                    : value.title
                                }${value.firstname} ${value.lastname}`}
                              </td>
                              <td className="ps-1">{`ม.${value.level}/${value.section}`}</td>
                              <td
                                className={`ps-1 font-bold ${
                                  totalScore > 0
                                    ? "text-green-600"
                                    : totalScore < 0
                                    ? "text-red-600"
                                    : "text-black"
                                }`}
                              >
                                {totalScore}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              );
            }
          )}
        </Await>
      </Suspense>
    </div>
  );
}
