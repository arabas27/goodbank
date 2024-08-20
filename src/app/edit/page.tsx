import Navbar from "@/ui/navbar";
import { useEffect, useState } from "react";
import { BsFillPenFill } from "react-icons/bs";
import {
  Link,
  Outlet,
  useLoaderData,
  useLocation,
  useNavigate,
} from "react-router-dom";

const Select = ({
  name,
  value,
  onChange,
  children,
}: {
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  children: JSX.Element | JSX.Element[];
}) => {
  return (
    <select
      className="border border-blue-500 rounded-sm p-1"
      name={name}
      id={name}
      value={value}
      onChange={onChange}
    >
      {children}
    </select>
  );
};

const SearchForm = ({
  level,
  section,
  setLevel,
  setSection,
}: {
  level: number;
  section: number;
  setLevel: React.Dispatch<React.SetStateAction<number>>;
  setSection: React.Dispatch<React.SetStateAction<number>>;
}) => {
  return (
    <div className="bg-gray-100 p-1 mx-3 rounded">
      <form className="flex flex-row p-3 bg-white rounded" action="">
        <div className="flex flex-col gap-1 w-full">
          <div className="flex flex-row gap-3">
            <div className="flex flex-col w-full">
              <label htmlFor="level">ชั้น</label>
              <Select
                name="level"
                value={level.toString()}
                onChange={(e) => setLevel(parseInt(e.currentTarget.value))}
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <option key={i} value={i + 1}>{`ม.${i + 1}`}</option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="section">ห้อง</label>
              <Select
                name="section"
                value={section.toString()}
                onChange={(e) => setSection(parseInt(e.currentTarget.value))}
              >
                {Array.from({ length: 8 }).map((_, i) => (
                  <option key={i} value={i + 1}>{`${i + 1}`}</option>
                ))}
              </Select>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

// const Pagination = () => {
//   return (
//     <div className="flex flex-row items-center justify-center gap-3">
//       <div className="flex p-1 border border-gray-500 bg-gray-100 rounded">
//         <BsChevronLeft className="w-6 h-6" />
//       </div>
//       <div className="flex flex-row">
//         <input
//           className="border border-gray-500 rounded-s p-1 w-12"
//           type="text"
//           name="pagination"
//           id="pagination"
//         />
//         <div className="flex flex-row items-center bg-gray-100 ps-2 py-1 pe-1 border border-gray-500 border-s-0 rounded-e">
//           60 หน้า
//         </div>
//       </div>
//       <div className="flex p-1 border border-gray-500 bg-gray-100 rounded">
//         <BsChevronRight className="w-6 h-6" />
//       </div>
//     </div>
//   );
// };

type TStudentData = {
  std_id: string;
  title: string;
  firstname: string;
  lastname: string;
  seat_no: number;
};

const TableRow = ({ value, index }: { value: TStudentData; index: number }) => {
  const { search } = useLocation();
  const [isChecked, setIsChecked] = useState(false);
  const handleClick = () => {
    setIsChecked(!isChecked);
  };

  const link: string = search === "" ? "?level=1&section=1" : search;
  // console.log(link);

  return (
    <tr className="border-b" onClick={handleClick}>
      <td className="flex flex-row justify-center gap-2 items-center ps-1 py-1 text-nowrap">
        <Link
          className="bg-yellow-500 p-2 rounded text-white"
          to={`editing/${value.std_id}${link}`}
        >
          <BsFillPenFill className="w-4 h-4" />
        </Link>
      </td>
      <td className="ps-1 py-1 text-nowrap">{index + 1}</td>
      <td className="ps-1 py-1 text-nowrap">{`${
        value.title === "เด็กชาย"
          ? "ด.ช."
          : value.title === "เด็กหญิง"
          ? "ด.ญ."
          : value.title
      }${value.firstname} ${value.lastname}`}</td>
    </tr>
  );
};

const Table = () => {
  const loaderData = useLoaderData() as TStudentData[];

  return (
    <div className="flex mx-3 p-1 bg-gray-100">
      <table className="w-full">
        <thead>
          <tr>
            <th className="ps-1 py-1"></th>
            <th className="ps-1 py-1 text-start">เลขที่</th>
            <th className="ps-1 py-1 text-start">ชื่อ-สกุล</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {loaderData.length === 0 ? (
            <tr>
              <td className="text-center p-3 text-lg font-bold" colSpan={3}>
                - ไม่พบข้อมูล -
              </td>
            </tr>
          ) : (
            loaderData.map((value, index) => (
              <TableRow value={value} index={index} key={index} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default function Edit() {
  const location = useLocation();
  const pathname = location.pathname;
  const [level, setLevel] = useState(1);
  const [section, setSection] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    if (location.search === "") {
      setLevel(1);
      setSection(1);
    }
  }, [location]);

  useEffect(() => {
    navigate(`?level=${level}&section=${section}`, { replace: true });
  }, [level, section, navigate]);

  return (
    <div className="flex flex-col gap-3 w-full">
      <Navbar />

      {pathname.split("/").length === 2 ? (
        <div className="p-3">
          <div className="flex flex-col gap-3">
            <SearchForm
              level={level}
              section={section}
              setLevel={setLevel}
              setSection={setSection}
            />
            {/* <Pagination /> */}
            <Table />
          </div>
        </div>
      ) : (
        <Outlet />
      )}
    </div>
  );
}
