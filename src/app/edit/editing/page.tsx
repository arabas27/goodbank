import { Await, Form, Link, useLoaderData, useSubmit } from "react-router-dom";
import {
  BsCaretDownFill,
  BsCaretUpFill,
  BsChevronDoubleRight,
  BsFillSave2Fill,
  BsFillTrashFill,
} from "react-icons/bs";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useAuth } from "@/script/auth/useAuth";
import Loading from "@/ui/Loading";

type TStdData = {
  std_id: string;
  title: string;
  firstname: string;
  lastname: string;
  level: number;
  section: number;
};

type THistory = {
  id: number;
  case_id: string;
  create_at: string;
  process_status: string;
  scdetail: string;
  score: number;
  ssdetail: string;
  type: "add" | "deduct" | "processed";
};

type TCase = {
  caseId?: string;
  detail?: string;
  children: [
    {
      id: number;
      status?: string;
      createAt?: string;
      type?: string;
      score: string;
    }
  ];
};

const Breadcrumbs = ({
  pathnames,
  titles,
}: {
  pathnames: Array<string>;
  titles: Array<string>;
}) => {
  return (
    <div className="flex flex-row">
      {pathnames.map((pathname, i) => (
        <div className="flex flex-row items-center" key={i}>
          {i !== pathnames.length - 1 ? (
            <Link className="text-blue-500" to={`${pathname}`}>
              {titles[i]}
            </Link>
          ) : (
            <div className="text-blue-600 font-bold">{titles[i]}</div>
          )}
          {i !== pathnames.length - 1 && (
            <div className="px-3">
              <BsChevronDoubleRight className="w-4 h-4" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const PersonalInfo = ({
  value,
  totalScore,
}: {
  value: TStdData;
  totalScore: number;
}) => {
  return (
    <div className="flex flex-row bg-gray-100 rounded p-1">
      <div className="flex flex-col grow gap-1">
        <h3 className="text-lg font-bold">ข้อมูลนักเรียน</h3>
        <div className="flex flex-row bg-white rounded p-3">
          <div className="flex flex-col gap-1">
            <div className="flex flex-row gap-3">
              <span>ชื่อ-สกุล:</span>
              <span>{`${
                value.title === "เด็กชาย"
                  ? "ด.ช."
                  : value.title === "เด็กหญิง"
                  ? "ด.ญ."
                  : value.title
              }${value.firstname} ${value.lastname}`}</span>
            </div>
            <div className="flex flex-row gap-6">
              <div className="flex flex-col">
                <div className="flex flex-row gap-3">
                  <span>รหัสนักเรียน:</span>
                  <span>{value.std_id}</span>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex flex-row gap-3">
                  <span>ชั้น:</span>
                  <span>{`ม.${value.level}/ ${value.section}`}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-6">
              <div className="flex flex-col">
                <div className="flex flex-row gap-3 items-center">
                  <span>คะแนน:</span>
                  <span
                    className={`text-xl font-bold ${
                      totalScore > 0
                        ? "text-green-600"
                        : totalScore < 0
                        ? "text-red-600"
                        : "text-black"
                    }`}
                  >
                    {totalScore}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Toggler = ({
  name,
  isChecked,
  handleTogglerChanged,
}: {
  name: string;
  isChecked: boolean;
  handleTogglerChanged: React.ChangeEventHandler;
}) => {
  return (
    <label
      className={clsx(
        "flex flex-col items-center justify-center w-28 rounded py-1 font-bold",
        {
          "bg-red-300 text-red-800": !isChecked,
          "bg-green-300 text-green-800": isChecked,
        }
      )}
      htmlFor={name}
    >
      <input
        className="hidden"
        type="checkbox"
        name={name}
        id={name}
        checked={isChecked}
        readOnly
        onChange={handleTogglerChanged}
      />
      {isChecked ? "เพิ่มคะแนน" : "ลดคะแนน"}
    </label>
  );
};

const Opener = ({
  name,
  isOpen,
  handleOpenerChanged,
}: {
  name: string;
  isOpen: boolean;
  handleOpenerChanged: React.ChangeEventHandler;
}) => {
  return (
    <label
      className="flex flex-col items-center justify-center rounded p-1 bg-white shadow-sm shadow-gray-500"
      htmlFor={name}
    >
      <input
        className="hidden"
        type="checkbox"
        name={name}
        id={name}
        checked={isOpen}
        readOnly
        onChange={handleOpenerChanged}
      />
      {isOpen ? <BsCaretDownFill /> : <BsCaretUpFill />}
    </label>
  );
};

const ReportItem = ({
  name,
  value,
  stdId,
}: {
  name: string;
  value: TCase;
  stdId: string;
}) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  let userData: { username: string };
  if (user) userData = JSON.parse(user);
  // add or delete score toggler button
  const [isChecked, setIsChecked] = useState(
    value.children[value.children.length - 1].type === "add"
  );
  // score input
  const [score, setScore] = useState(
    value.children[value.children.length - 1].score
  );

  // history opener
  const [isOpen, setIsOpen] = useState(false);
  const [height, setHeight] = useState(0);
  const handleTogglerChanged = () => {
    setIsChecked(!isChecked);
  };
  const handleOpenerChanged = () => {
    setIsOpen(!isOpen);
  };

  // animation
  const [springs, api] = useSpring(() => ({
    from: { height: `0px` },
  }));

  useEffect(() => {
    isOpen ? setHeight(24 * value.children.length) : setHeight(0);
  }, [isOpen, value.children.length]);

  useEffect(() => {
    api.start({
      from: { height: `0px` },
      to: { height: `${height}px` },
    });
  }, [height, api, isOpen]);

  // update css and some useState data
  useEffect(() => {
    setScore(value.children[value.children.length - 1].score);
    setIsChecked(value.children[value.children.length - 1].type === "add");
    setIsOpen(false);
    setHeight(0);
    setIsLoading(false);
  }, [value, name]);

  const originScore = value.children[value.children.length - 1].score;
  const originType = value.children[value.children.length - 1].type === "add";

  // submit function
  const submit = useSubmit();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (formData.get("action") === "edited") {
      if (score === originScore && isChecked === originType) {
        alert("ต้องปรังปรุงข้อมูลก่อนบันทึก");
        return;
      }
    }
    setIsLoading(true);
    formData.append(
      "id",
      value.children[value.children.length - 1].id.toString()
    );
    formData.append("stdId", stdId);
    if (score) formData.append("score", score.toString());
    formData.append("type", isChecked === false ? "deduct" : "add");
    // console.log(formData.get("type"));
    formData.append("doer_id", userData.username);

    submit(formData, {
      method: "POST",
    });
  };

  return (
    <>
      {isLoading && (
        <div className="absolute top-0 left-0 bg-black bg-opacity-5 w-full h-full">
          <div className="flex flex-col items-center justify-center h-full">
            <div
              className="flex flex-col items-center justify-center
           rounded-full bg-white bg-opacity-5 w-20 h-20
           outline outline-4 outline-blue-800 antialiased"
            >
              <Loading />
            </div>
          </div>
        </div>
      )}
      <div
        className={clsx(
          "flex flex-col border rounded px-2 shadow shadow-gray-500 pb-2",
          {
            "bg-green-100 border-green-500": isChecked,
            "bg-red-100 border-red-500": !isChecked,
          }
        )}
      >
        <div
          className={clsx(
            "flex flex-row justify-between items-center border-b py-2",
            {
              "border-b-green-500": isChecked,
              "border-b-red-500": !isChecked,
            }
          )}
        >
          <div className="flex flex-col">
            <div>{value.caseId}</div>
            {/* <div>20 ม.ค. 67</div> */}
          </div>
          <div className="flex flex-row items-center gap-1">
            <input
              type="number"
              name={`score${name}`}
              id={`score${name}`}
              className={clsx(
                "flex w-16 rounded-sm p-1 border text-end font-bold",
                {
                  "bg-green-50 text-green-900 border-green-500": isChecked,
                  "bg-red-50 text-red-900 border-red-500": !isChecked,
                }
              )}
              value={score}
              onChange={(e) => {
                if (/^\d+$/.test(e.currentTarget.value)) {
                  setScore(e.currentTarget.value);
                }
              }}
              onClick={(e) => e.currentTarget.select()}
              autoComplete="off"
            />
            <div className="text-sm">คะแนน</div>
          </div>
        </div>
        <div className="flex flex-row py-1 gap-1">
          <div>{value.detail}</div>
        </div>
        <div className="flex flex-row justify-between">
          <Toggler
            name={`type${name}`}
            isChecked={isChecked}
            handleTogglerChanged={handleTogglerChanged}
          />
          <div className="flex flex-row gap-3">
            <Form method="post" onSubmit={handleSubmit}>
              <input
                className="hidden"
                type="text"
                defaultValue="edited"
                name="action"
                id="edit"
              />
              <button className="flex flex-col items-center justify-center w-14 px-3 py-1 bg-blue-500 text-white rounded">
                <BsFillSave2Fill className="w-4 h-4" />
                <span className="text-sm">บันทึก</span>
              </button>
            </Form>
            <Form method="post" onSubmit={handleSubmit}>
              <input
                className="hidden"
                type="text"
                defaultValue="deleted"
                name="action"
                id="delete"
              />
              <button className="flex flex-col items-center justify-center w-14 px-3 py-1 bg-red-500 text-white rounded">
                <BsFillTrashFill className="w-4 h-4" />
                <span className="text-sm">ลบ</span>
              </button>
            </Form>
          </div>
        </div>
        <div className="flex felx-row mt-3">
          <div className="flex flex-col grow gap-1">
            <Opener
              name={`opener${name}`}
              isOpen={isOpen}
              handleOpenerChanged={handleOpenerChanged}
            />
            {isOpen && (
              <animated.div
                className="w-full shadow-sm shadow-gray-500"
                style={{ ...springs }}
              >
                {value.children.map((value, index) => (
                  <div
                    className="flex flex-row justify-between bg-white px-3"
                    key={index}
                  >
                    <div>
                      {value.status === "processed"
                        ? "ดำเนินการ"
                        : value.status === "approve1"
                        ? "อนุมัติ"
                        : value.status === "cancelled"
                        ? "ยกเลิก"
                        : value.status === "edited"
                        ? "ปรับปรุง"
                        : "ลบรายการ"}
                    </div>
                    <div>{value.createAt}</div>
                  </div>
                ))}
              </animated.div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default function Editing() {
  const { search } = location;
  // console.log(location);
  const pathnames: Array<string> = ["/", `/edit${search}`, ""];
  const titles: Array<string> = ["หน้าแรก", "แก้ไข", "กำลังแก้ไข"];
  // retreive data like loader
  const loaderData = useLoaderData() as {
    stdData: TStdData;
    history: THistory[];
  };

  // console.log(loaderData.history);
  const cases: TCase[] = [];

  // reload data

  loaderData.history.forEach((value, index, self) => {
    const uniqueCases = self.findIndex(
      (selfValue) => selfValue.case_id === value.case_id
    );

    if (uniqueCases === index) {
      cases.push({
        caseId: value.case_id,
        detail: value.scdetail || value.ssdetail,
        children: [
          {
            id: value.id,
            status: value.process_status,
            createAt: value.create_at,
            type: value.type,
            score: value.score?.toString(),
          },
        ],
      });
      // console.log(cases);
    } else {
      // console.log(value);
      const matchedIndex = cases.findIndex(
        (selfValue) => selfValue.caseId === value.case_id
      );

      // if (value.process_status === "deleted") {
      //   console.log(matchedIndex + " ");
      //   console.log(value);
      // }

      if (value.score !== null) {
        cases[matchedIndex].children.push({
          id: value.id,
          status: value.process_status,
          createAt: value.create_at,
          type: value.type,
          score: value.score.toString(),
        });
      }
    }
  });
  // loaderData.history = [];
  // cases[5].children.push(["test"]);
  // console.log(cases[5]);

  const filteredCases = cases.filter(
    (value) => value.children[value.children.length - 1].status !== "deleted"
  );

  filteredCases.sort(
    (a, b) =>
      a.children[a.children.length - 1].id -
      b.children[b.children.length - 1].id
  );

  const totalScore =
    filteredCases.reduce(
      (total, { children }) =>
        children[children.length - 1].type === "add"
          ? total + parseInt(children[children.length - 1].score)
          : total - parseInt(children[children.length - 1].score),
      0
    ) + 100;
  // console.log(totalScore);
  // console.log(filteredCases);

  return (
    <div className="flex flex-col gap-3 w-full p-3">
      <Breadcrumbs pathnames={pathnames} titles={titles} />
      <PersonalInfo value={loaderData.stdData} totalScore={totalScore} />
      {loaderData.history.length === 0 ? (
        <div className="text-center font-bold text-xl mt-6">
          - ไม่พบประวัติ -
        </div>
      ) : (
        <Await resolve={filteredCases}>
          {filteredCases.map((value, index) => (
            <ReportItem
              name={`item${index}`}
              value={value}
              key={index}
              stdId={loaderData.stdData.std_id}
            />
          ))}
        </Await>
      )}

      {/* <ReportItem name="tests" /> */}
    </div>
  );
}
