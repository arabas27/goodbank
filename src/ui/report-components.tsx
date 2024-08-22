import { ReportContext } from "@/app/report/page";
import { TActionData } from "@/app/report/type";
import { useAuth } from "@/script/auth/useAuth";
import clsx from "clsx";
import React, { useContext, useEffect, useState } from "react";
import { BsChevronLeft, BsChevronRight, BsFillSendFill } from "react-icons/bs";
import { Form, useActionData, useLocation, useSubmit } from "react-router-dom";
import { FilterSelect } from "./select";

export const Input = ({
  name,
  placeHolder,
}: {
  name: string;
  placeHolder?: string;
}) => {
  return (
    <input
      className="border  border-blue-300 rounded-sm p-1"
      type="text"
      name={name}
      id={name}
      placeholder={placeHolder}
    />
  );
};

// export const Select = ({
//   name,
//   defaultValue,
//   onChange,
//   children,
// }: {
//   name: string;
//   defaultValue: string;
//   onChange?: React.ChangeEventHandler<HTMLSelectElement>;
//   children: JSX.Element | JSX.Element[];
// }) => {
//   return (
//     <select
//       className="outline outline-1 outline-gray-400 focus:outline-gray-900 rounded-sm p-1"
//       name={name}
//       id={name}
//       defaultValue={defaultValue}
//       onChange={onChange}
//     >
//       {children}
//     </select>
//   );
// };

export const Toggler = ({
  name,
  type,
  handleClick,
}: {
  name: string;
  type: "" | "add" | "deduct";
  handleClick: React.MouseEventHandler;
}) => {
  return (
    <label
      className={clsx(
        "flex flex-col items-center justify-center w-24 rounded py-1 font-bold",
        {
          "bg-white text-sm text-gray-800 border border-gray-500": type === "",
          "bg-green-300 text-xl text-green-800": type === "add",
          "bg-red-300 text-xl text-red-800": type === "deduct",
        }
      )}
      htmlFor={name}
    >
      <input
        className="hidden"
        type="text"
        name={name}
        id={name}
        readOnly
        onClick={handleClick}
        value={type}
      />
      {type === "" ? (
        <>
          <span>เลือก</span>
          <span>ประเภท</span>
        </>
      ) : type === "add" ? (
        "เพิ่ม"
      ) : (
        "ลด"
      )}
    </label>
  );
};

export const ReportForm = () => {
  const actionData = useActionData() as TActionData;
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const level = (
    searchParams.get("level") ? searchParams.get("level") : "1"
  ) as string;
  const section = (
    searchParams.get("section") ? searchParams.get("section") : "1"
  ) as string;
  const editedSearch = search.replace(/\?/, "&");
  const { user } = useAuth();
  const { selectedStudentID, setSelectedStudentID, type, setType } =
    useContext(ReportContext);
  const [detail, setDetail] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const submit = useSubmit();
  const handleClick = () => {
    setType((prevType) =>
      prevType === "" ? "add" : prevType === "add" ? "deduct" : "add"
    );
  };

  // console.log(actionData);

  useEffect(() => {
    // console.log(actionData?.data.length);
    if (actionData && actionData?.data.length > 0) {
      const ok: string[] = [];
      const failed: string[] = [];
      actionData.data.map((data) => {
        if (data.status === 200) ok.push(`${data.std_id} ${data.name}`);
        if (data.status === 500) failed.push(`${data.std_id} ${data.name}`);
      });
      alert(
        `บันทึกสำเร็จ ${ok.length} รายการ\n   ${ok.join(
          "\n   "
        )}\nบันทึกล้มเหลว ${failed.length} รายการ \n   ${failed.join("\n   ")}`
      );
      return setIsDisabled(false);
    }
  }, [actionData]);

  return (
    <Form
      className="flex flex-row mx-3 bg-gray-100 rounded"
      onSubmit={(e) => {
        e.preventDefault();
        const doerID = JSON.parse(user as string).username;
        const warns = [];
        const formData = new FormData(e.currentTarget);

        // validate data
        if (formData.get("detail") === "") {
          warns.push("- ใส่รายระเอียดพฤติกรรม");
        }

        if (type.toString() === "") {
          warns.push("- เลือกประเภทพฤติกรรม");
        }
        if (selectedStudentID.length <= 0) {
          warns.push("- เลือกนักเรียน");
        }

        if (warns.length > 0) {
          alert(warns.join("\n"));
          return;
        }

        // disabled submit button
        setIsDisabled(true);

        // append some data into form
        formData.append("selectedStudentID", JSON.stringify(selectedStudentID));
        formData.append("doerID", doerID);
        formData.append("type", type);
        formData.append("level", level);
        formData.append("section", section);

        // reset all input
        setDetail("");
        setType("");
        setSelectedStudentID([]);

        // submit data to action
        submit(formData, {
          method: "POST",
          action: `./?index${editedSearch}`,
        });
      }}
    >
      <div className="flex flex-col grow gap-1 p-1">
        <div className="flex flex-col items-center my-3">
          <h3 className="font-bold text-xl px-3 py-1 bg-white border border-gray-500 rounded w-fit">
            รายงานพฤติกรรม
          </h3>
        </div>

        <div
          className={clsx("flex flex-col gap-3 rounded p-3 border", {
            "bg-gray-100 border-gray-500": type === "",
            "bg-green-100 border-green-500": type === "add",
            "bg-red-100 border-red-500": type === "deduct",
          })}
        >
          <div className="flex flex-row grow">
            <div className="flex flex-col grow">
              <label htmlFor="detail">รายละเอียด</label>
              <textarea
                className={clsx("border w-full rounded-sm p-1", {
                  "bg-white border-gray-500": type === "",
                  "bg-green-50 border-green-500": type === "add",
                  "bg-red-50 border-red-500": type === "deduct",
                })}
                onChange={(e) => {
                  setDetail(e.currentTarget.value);
                }}
                name="detail"
                id="detail"
                rows={3}
                value={detail}
              ></textarea>
            </div>
          </div>
          <div className="flex flex-row grow">
            <div className="flex flex-col grow border border-gray-500 rounded mt-2">
              <div className="relative pt-4">
                <div className="absolute -top-3 left-2 bg-white px-3 border border-gray-500 rounded">
                  เลือกคะแนน
                </div>
                <div className="flex flex-col gap-1 ps-5">
                  <div className="flex flex-row gap-1">
                    <input
                      type="radio"
                      name="score"
                      id="score0"
                      value={0}
                      defaultChecked
                    />
                    <label htmlFor="score0">ส่งต่อฝ่ายกิจการ</label>
                  </div>
                  <div className="flex flex-row gap-1">
                    <input type="radio" name="score" id="score1" value={1} />
                    <label htmlFor="score1">1 คะแนน</label>
                  </div>
                  <div className="flex flex-row gap-1">
                    <input type="radio" name="score" id="score2" value={2} />
                    <label htmlFor="score2">2 คะแนน</label>
                  </div>
                  <div className="flex flex-row gap-1">
                    <input type="radio" name="score" id="score3" value={3} />
                    <label htmlFor="score3">3 คะแนน</label>
                  </div>
                  <div className="flex flex-row gap-1">
                    <input type="radio" name="score" id="score4" value={4} />
                    <label htmlFor="score4">4 คะแนน</label>
                  </div>
                  <div className="flex flex-row gap-1">
                    <input type="radio" name="score" id="score5" value={5} />
                    <label htmlFor="score5">5 คะแนน</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row grow">
            <div className="flex flex-col grow">
              <Toggler name="type" type={type} handleClick={handleClick} />
            </div>
            <button
              className="flex flex-row gap-1 items-center justify-center px-3 py-1 bg-blue-500 text-white rounded"
              disabled={isDisabled}
              id="reportSubmitButton"
            >
              <BsFillSendFill className="w-6 h-6" />
              <span className="font-bold">ส่ง</span>
            </button>
          </div>
          <div className="flex flex-row text-red-600 gap-3">
            <span>หมายเหตุ: </span>
            <span className="px-1 text-justify">
              แตะปุ่ม "เลือกประเภท" 1 ครั้ง สำหรับเลือกประเภท "เพิ่มคะแนน"
              และแตะปุ่ม 2 ครั้ง สำหรับเลือกประเภท "ลดคะแนน"
            </span>
          </div>
        </div>
      </div>
    </Form>
  );
};

export const SearchForm = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const level = searchParams.get("level");
  const section = searchParams.get("section");
  const submit = useSubmit();

  const [data, setData] = useState<{ level: string; section: string }>({
    level: level === null ? "1" : level,
    section: section === null ? "1" : section,
  });

  return (
    <div className="bg-gray-100 p-1 mx-3 rounded mt-3">
      <div className="relative">
        <h3 className="absolute -top-5 left-5 text-lg font-bold bg-white px-3 py-1 rounded border border-gray-500">
          เลือกชั้น
        </h3>
      </div>
      <Form
        className="flex flex-row px-3 py-6 bg-white rounded"
        autoComplete="off"
        role="search"
      >
        <div className="flex flex-col gap-1 w-full">
          {/* <div className="flex flex-row">
            <div className="flex flex-col w-full">
              <label htmlFor="search">ค้นหา</label>
              <Input name="search" placeHolder="ใส่ชื่อหรือนามสกุลเพื่อค้นหา" />
            </div>
          </div> */}
          <div className="flex flex-row gap-3">
            <div className="flex flex-col w-full">
              <label htmlFor="level">ชั้น</label>
              <FilterSelect
                name="level"
                defaultValue={data.level}
                onChange={(e) => {
                  setData((prevItem) => ({
                    level: e.target.value,
                    section: prevItem.section,
                  }));

                  submit(e.currentTarget.form);
                }}
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
                defaultValue={data.section}
                onChange={(e) => {
                  setData((prevItem) => ({
                    level: prevItem.level,
                    section: e.target.value,
                  }));

                  submit(e.currentTarget.form);
                }}
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

export const Pagination = () => {
  return (
    <div className="flex flex-row items-center justify-center gap-3">
      <div className="flex p-1 border border-gray-500 bg-gray-100 rounded">
        <BsChevronLeft className="w-6 h-6" />
      </div>
      <div className="flex flex-row">
        <input
          className="border border-gray-500 rounded-s p-1 w-12"
          type="text"
          name="pagination"
          id="pagination"
        />
        <div className="flex flex-row items-center bg-gray-100 ps-2 py-1 pe-1 border border-gray-500 border-s-0 rounded-e">
          60 หน้า
        </div>
      </div>
      <div className="flex p-1 border border-gray-500 bg-gray-100 rounded">
        <BsChevronRight className="w-6 h-6" />
      </div>
    </div>
  );
};

export const Table = () => {
  const { data } = useContext(ReportContext);

  const TableRow = ({
    data,
  }: {
    data: {
      std_id: string;
      seat_no: number | null;
      title: string | null;
      firstname: string | null;
      lastname: string | null;
      level: number | null;
      section: number | null;
    };
    index: number;
  }) => {
    const { selectedStudentID, setSelectedStudentID } =
      useContext(ReportContext);

    return (
      <tr
        className="border-b"
        onClick={() => {
          setSelectedStudentID((prevItems) => {
            if (
              prevItems.find((item) => item.std_id === data.std_id)?.std_id ===
              data.std_id
            ) {
              return prevItems.filter((item) => item.std_id !== data.std_id);
            } else {
              return [...prevItems, data];
            }
          });
        }}
      >
        <td className="ps-1 py-2">
          <input
            type="checkbox"
            checked={
              selectedStudentID.find((item) => item.std_id === data.std_id)
                ?.std_id === data.std_id
            }
            name={data.std_id}
            id={data.std_id}
            readOnly
          />
        </td>
        <td className="ps-1 py-1 text-nowrap">{data.seat_no}</td>
        <td className="ps-1 py-1 text-nowrap">{data.std_id}</td>
        <td className="ps-1 py-1 text-nowrap">{`${data.title}${data.firstname} ${data.lastname}`}</td>
        {/* <td className="ps-1 py-1 text-nowrap">{`${data.level}/${data.section}`}</td> */}
      </tr>
    );
  };

  return (
    <div className="flex mx-3 p-1">
      <table className="w-full rounded shadow shadow-gray-600">
        <thead>
          <tr>
            <th className="ps-1 py-1"></th>
            <th className="ps-1 py-1 text-start">เลขที่</th>
            <th className="ps-1 py-1 text-start">รหัส</th>
            <th className="ps-1 py-1 text-start">ชื่อ-สกุล</th>
            {/* <th className="ps-1 py-1 text-start">ชั้น</th> */}
          </tr>
        </thead>
        <tbody className="bg-white">
          {data.length > 0 ? (
            data.map((d, i) => <TableRow key={i} data={d} index={i} />)
          ) : (
            <tr>
              <td role="col" colSpan={4}>
                <div className="text-center py-3">- ไม่พบรายชื่อนักเรียน -</div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export const SelectedTable = () => {
  const { selectedStudentID } = useContext(ReportContext);

  const TableRow = ({
    data,
  }: {
    data: {
      std_id: string;
      seat_no: number | null;
      title: string | null;
      firstname: string | null;
      lastname: string | null;
      level: number | null;
      section: number | null;
    };
    index: number;
  }) => {
    const { selectedStudentID, setSelectedStudentID } =
      useContext(ReportContext);

    return (
      <tr
        className="border-b"
        onClick={() => {
          setSelectedStudentID((prevItems) => {
            if (
              prevItems.find((item) => item.std_id === data.std_id)?.std_id ===
              data.std_id
            ) {
              return prevItems.filter((item) => item.std_id !== data.std_id);
            } else {
              return [...prevItems, data];
            }
          });
        }}
      >
        <td role="col" className="ps-1 py-2">
          <input
            type="checkbox"
            checked={
              selectedStudentID.find((item) => item.std_id === data.std_id)
                ?.std_id === data.std_id
            }
            name={data.std_id}
            id={data.std_id}
            readOnly
          />
        </td>
        <td role="col" className="ps-1 py-1 text-nowrap">
          {data.seat_no}
        </td>
        <td
          role="col"
          className="ps-1 py-1 text-nowrap"
        >{`${data.title}${data.firstname} ${data.lastname}`}</td>
        <td
          role="col"
          className="ps-1 py-1 text-nowrap"
        >{`${data.level}/${data.section}`}</td>
      </tr>
    );
  };

  return (
    <div className="flex mx-3 p-1">
      <table className="w-full rounded shadow shadow-gray-600">
        <thead>
          <tr>
            <th className="ps-1 py-1"></th>
            <th className="ps-1 py-1 text-start">เลขที่</th>
            <th className="ps-1 py-1 text-start">ชื่อ-สกุล</th>
            <th className="ps-1 py-1 text-start">ชั้น</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {selectedStudentID.length > 0 ? (
            selectedStudentID.map((d, i) => (
              <TableRow key={i} data={d} index={i} />
            ))
          ) : (
            <tr>
              <td role="col" colSpan={4}>
                <div className="text-center py-3">
                  - ไม่พบรายชื่อที่ถูกเลือก -
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
