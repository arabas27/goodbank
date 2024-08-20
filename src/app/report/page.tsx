import Navbar from "@/ui/navbar";
import { createContext, useEffect, useState } from "react";
import { useLoaderData, useNavigation } from "react-router-dom";
import type { TData, TReportContext } from "@/app/report/type";
import {
  ReportForm,
  SearchForm,
  SelectedTable,
  Table,
} from "@/ui/report-components";
import Loading from "../../ui/Loading";
// import { useCookies } from "react-cookie";

export const ReportContext = createContext<TReportContext>({
  type: "",
  setType: () => {},
  selectedStudentID: [],
  setSelectedStudentID: () => {},
  students: [],
  setStudents: () => {},
  data: [],
  setData: () => {},
});

export default function Report() {
  // const [cookies] = useCookies();
  // console.log(cookies.user);
  const { state } = useNavigation();
  const loaderData = useLoaderData() as TData[];

  const [data, setData] = useState<TData[]>(loaderData);
  // control add or deduct state
  const [type, setType] = useState<"" | "add" | "deduct">("");
  const [selectedStudentID, setSelectedStudentID] = useState<TData[]>([]);

  useEffect(() => {
    const limit = 10;
    if (selectedStudentID.length > limit) {
      alert(`เลือกได้ไม่เกิน ${limit} รายการ`);
      setSelectedStudentID(selectedStudentID.slice(0, limit));
    }

    // update and remove selected data from data
    setData(() => {
      return loaderData.filter((d) => {
        return selectedStudentID.find((sd) => sd.std_id === d.std_id)
          ? false
          : true;
      });
    });

    setData((prevItem) => {
      // reverse data
      // const x: TData[] = [];
      // Object.entries(selectedStudentID)
      //   .reverse()
      //   .forEach((v) => {
      //     x.push(v[1]);
      //   });

      return [
        // ...selectedStudentID,
        ...prevItem.sort((a, b) => Number(a.seat_no) - Number(b.seat_no)),
      ];
    });
  }, [selectedStudentID, loaderData]);
  // contain selected students
  const [students, setStudents] = useState<TData[]>([]);

  return (
    <div className="flex flex-col flex-nowrap gap-3 w-full">
      <ReportContext.Provider
        value={{
          type,
          setType,
          selectedStudentID,
          setSelectedStudentID,
          students,
          setStudents,
          data,
        }}
      >
        <Navbar />
        <ReportForm />
        {/* <Pagination /> */}
        <div className="flex flex-col">
          <div className="mt-6 py-1 bg-blue-50 pt-4">
            <div className="relative px-3">
              <h3 className="absolute -top-9 left-8 text-lg bg-white rounded font-boldbg-white border border-gray-500 w-fit px-3 py-1">
                นักเรียนที่ถูกเลือก
              </h3>
            </div>
            <SelectedTable />
          </div>
        </div>

        <SearchForm />

        <div className="mt-6 py-1 bg-blue-50 pt-4">
          <div className="relative px-3">
            <h3 className="absolute -top-9 left-8 text-lg bg-white rounded font-boldbg-white border border-gray-500 w-fit px-3 py-1">
              เลือกนักเรียน
            </h3>
          </div>
          {state === "loading" ? <Loading /> : <Table />}
        </div>
      </ReportContext.Provider>
    </div>
  );
}
