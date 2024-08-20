import Navbar from "@/ui/navbar";
import { FilterSelect } from "@/ui/select";
import {
  Form,
  useLoaderData,
  useLocation,
  useNavigate,
  useSubmit,
} from "react-router-dom";

type TSeachForm = {
  level: string;
  section: string;
};

export const SearchForm = ({ level, section }: TSeachForm) => {
  const submit = useSubmit();

  return (
    <div className="bg-gray-100 p-1 mx-3 rounded">
      <div className="flex flex-row">
        <h3 className="font-bold text-xl p-1">ค้นหาห้องเรียน</h3>
      </div>
      <Form
        className="flex flex-row p-3 bg-white rounded"
        autoComplete="off"
        role="search"
      >
        <div className="flex flex-col gap-1 w-full">
          <div className="flex flex-row gap-3">
            <div className="flex flex-col w-full">
              <label htmlFor="level">ชั้น</label>
              <FilterSelect
                name="level"
                defaultValue={level}
                onChange={(e) => submit(e.currentTarget.form)}
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <option key={i} value={i + 1}>{`ม.${i + 1}`}</option>
                ))}
              </FilterSelect>
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="section">ห้อง</label>
              <FilterSelect
                name="section"
                defaultValue={section}
                onChange={(e) => submit(e.currentTarget.form)}
              >
                {Array.from({ length: 8 }).map((_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </FilterSelect>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

type TLoaderData = {
  data: TData[];
};

type TScore = {
  case_id: string;
  create_at: string;
  detail: string;
  doer_id: string;
  id: number;
  process_status: string;
  score: number;
  std_id: string;
  step: number | string;
  type: string;
};

type TStdInfo = {
  std_id: string;
  seat_no: number | null;
  title: string | null;
  firstname: string | null;
  lastname: string | null;
  level: number | null;
  section: number | null;
};

type TData = {
  score: TScore[];
  stdInfo: TStdInfo;
};

type TTable = {
  level: string;
};

const Table = ({ level }: TTable) => {
  const loaderData = useLoaderData() as TLoaderData;

  const TableRow = ({
    data,
  }: {
    data: {
      score: TScore[];
      stdInfo: TStdInfo;
    };
    index: number;
  }) => {
    const navigate = useNavigate();
    3;

    const approvedScore = data.score.filter((value) => value.step == "2");

    let sum: number = 0;

    approvedScore.forEach(({ type, score, create_at }) => {
      if (level === "4" && create_at < "2024-05-01 00:00:00") return;

      if (type === "add") {
        sum += parseInt(score.toString());
      } else if (type === "deduct") {
        sum -= parseInt(score.toString());
      }
    });

    return (
      <tr
        className="border-b"
        onClick={() => navigate(`/std-history/${data.stdInfo.std_id}`)}
      >
        <td className="ps-1 py-2">
          <button className="bg-blue-500 py-1 px-2 rounded font-bold text-white">
            เลือก
          </button>
        </td>
        <td className="ps-1 py-1 text-nowrap">{data.stdInfo.seat_no}</td>
        <td className="ps-1 py-1 text-nowrap">{data.stdInfo.std_id}</td>
        <td className="ps-1 py-1 text-nowrap">{`${
          data.stdInfo.title === "เด็กชาย"
            ? "ด.ช."
            : data.stdInfo.title === "เด็กหญิง"
            ? "ด.ญ."
            : data.stdInfo.title
        }${data.stdInfo.firstname} ${data.stdInfo.lastname}`}</td>
        <td
          className={
            "ps-1 py-1 text-nowrap font-bold" +
            (100 + sum < 0
              ? " text-red-600"
              : 100 + sum > 0
              ? " text-green-700"
              : "text-black")
          }
        >{`${100 + sum}`}</td>
      </tr>
    );
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex mx-3 px-1 bg-gray-100">
        <table className="w-full text-sm sm:text-base">
          <thead>
            <tr className="bg-gray-100">
              <th className="ps-1 py-1"></th>
              <th className="ps-1 py-3 text-start">ที่</th>
              <th className="ps-1 py-1 text-start">รหัส</th>
              <th className="ps-1 py-1 text-start">ชื่อ-สกุล</th>
              <th className="ps-1 py-1 text-start">คะแนน</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {loaderData.data.length > 0 ? (
              loaderData.data.map((d, i) => (
                <TableRow key={i} data={d} index={i} />
              ))
            ) : (
              <tr>
                <td role="col" colSpan={4}>
                  <div className="text-center py-3">
                    - ไม่พบรายชื่อนักเรียน -
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function PersonInfo() {
  const { search } = useLocation();
  const query = new URLSearchParams(search);

  const level = (query.get("level") ? query.get("level") : "1") as string;
  const section = (query.get("section") ? query.get("section") : "1") as string;

  return (
    <div className="flex flex-col gap-3">
      <Navbar />
      <SearchForm level={level} section={section} />
      <Table level={level} />
    </div>
  );
}
