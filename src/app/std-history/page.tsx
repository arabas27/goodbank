import Navbar from "@/ui/navbar";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { animated, useSpring } from "@react-spring/web";

type TStdData = {
  title: string;
  firstname: string;
  lastname: string;
  level: number;
  section: number;
  seat_no: number;
  std_id: string;
};

type THistory = {
  case_id?: string;
  create_at?: string;
  scdetail?: string;
  ssdetail?: string;
  doer_id?: string;
  edit_at?: string;
  id?: number;
  process_status?: string;
  score?: number;
  std_id?: string;
  step?: number;
  type?: string;
};

type TCaseDetail = {
  case_id: string;
  detail: string | null;
};

type TCase = {
  caseId?: string;
  detail?: string;
  children: [
    {
      status?: string;
      createAt: string;
      type?: string;
      score?: string;
    }
  ];
};

const PersonalInfo = ({
  stdData,
  totalScore,
  totalCase,
}: {
  stdData: TStdData;
  totalScore: number;
  totalCase: number;
}) => {
  return (
    <div className="flex flex-col border border-gray-500 mx-3 px-1 rounded mt-6">
      <h3 className="text-lg font-bold">ข้อมูลบุคคล</h3>
      <div className="flex flex-row gap-3">
        <span> ชื่อ - สกุล</span>
        <span className="font-bold">{`${stdData.title}${stdData.firstname} ${stdData.lastname}`}</span>
      </div>
      <div className="flex flex-row gap-3">
        <span>รหัสนักเรียน</span>
        <span className="font-bold">{stdData.std_id}</span>
      </div>
      <div className="flex flex-row gap-3">
        <span>ชั้น</span>
        <span className="font-bold">{`ม.${stdData.level}/${stdData.section}`}</span>
      </div>
      <div className="flex flex-row gap-10">
        <div>
          จำนวน <span className="font-bold">{totalCase + 1}</span> รายการ
        </div>
        <div className="flex flex-row gap-3">
          <span>คะแนนรวม</span>
          <span
            className={`font-bold ${
              totalScore < 0
                ? "text-red-700"
                : totalScore > 0
                ? "text-green-700"
                : "text-black"
            }`}
          >
            {totalScore}
          </span>
        </div>
      </div>
    </div>
  );
};

const ItemBox = ({ value }: { value: TCase; index?: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [height, setHeight] = useState(0);
  const [springs, api] = useSpring(() => ({
    from: { height: `0px` },
  }));
  // 0.25 * 6 = 1 line or 24 * 1 = 1 line
  useEffect(() => {
    isOpen ? setHeight(24 * value.children.length) : setHeight(0);
  }, [isOpen, value.children.length]);

  useEffect(() => {
    api.start({
      from: { height: `0px` },
      to: { height: `${height}px` },
    });
  }, [height, api, isOpen]);

  // const handleClick = () => {
  //   setIsOpen(!isOpen);
  // };

  // console.log(value);

  return (
    <div
      className="border-b border-gray-300 pb-2"
      onClick={() => setIsOpen(!isOpen)}
    >
      {/* info */}
      <div className="flex flex-row gap-1">
        {/* <div className="">{index && index + 1}</div> */}
        <div className="w-4/12">{value.caseId}</div>
        <div className="w-4/12">{value.detail}</div>

        <div
          className={clsx("w-2/12 font-bold", {
            "text-red-600":
              value.children[value.children.length - 1].type === "deduct",
            "text-green-600":
              value.children[value.children.length - 1].type === "add",
          })}
        >{`${
          value.children[value.children.length - 1].type === "deduct" ? "-" : ""
        }${value.children[value.children.length - 1].score}`}</div>
        <div className={`w-2/12 text-blue-600`}>
          {isOpen ? "น้อยลง" : "เพิ่มเติม"}
        </div>
      </div>
      <div className="flex flex-col grow">
        <animated.div
          className="overflow-y-auto indent-3"
          style={{ ...springs }}
          // onClick={handleClick}
        >
          {value.children.map((el, i) => (
            <div className="flex flex-row justify-between items-cente" key={i}>
              <div>
                {el.status === "processed"
                  ? "ดำเนินการ"
                  : el.status === "approve1"
                  ? "อนุมัติ"
                  : el.status === "deleted"
                  ? "ลบ"
                  : el.status === "cancelled"
                  ? "ยกเลิก"
                  : "อื่น ๆ"}
              </div>
              <div>{el.createAt}</div>
            </div>
          ))}
        </animated.div>
      </div>
    </div>
  );
};

export default function StudentHistory() {
  const loaderData = useLoaderData() as {
    std_data: TStdData;
    history: THistory[];
    case_detail: TCaseDetail[];
  };

  const stdData = loaderData.std_data;
  // // filter out null detail
  // const fileredNullCaseDetail = loaderData.case_detail.filter(
  //   (element) => element.detail !== null
  // );
  // // remove duplicated element from filtered case detail
  // const removedDuplicatedCaseDetail = fileredNullCaseDetail.filter(
  //   (element, index, self) =>
  //     index === self.findIndex((t) => t.case_id === element.case_id)
  // );
  // // Filter between processed history out
  // const fiteredLastStepHistory = loaderData.history.filter(
  //   (element) => element.step === 2
  // );

  // group case by id
  const cases: TCase[] = [];

  loaderData.history.forEach((value, index, self) => {
    const uniqueCaseIndex = self.findIndex(
      (selfValue) => selfValue.case_id === value.case_id
    );

    if (uniqueCaseIndex === index) {
      value.create_at !== undefined &&
        cases.push({
          caseId: value.case_id,
          detail: value.scdetail || value.ssdetail,
          children: [
            {
              status: value.process_status,
              createAt: value.create_at,
              type: value.type,
              score: value.score?.toString(),
            },
          ],
        });
    } else {
      const matchedIndex = cases.findIndex(
        (selfValue) => selfValue.caseId === value.case_id
      );

      if (value.score) {
        value.create_at !== undefined &&
          cases[matchedIndex].children.push({
            status: value.process_status,
            createAt: value.create_at,
            type: value.type,
            score: value.score.toString(),
          });
      }
    }
  });

  // console.log(stdData);

  // console.log(parseInt(stdData.level.toString()) === 5);
  // console.log(cases);
  const filteredCases = cases.filter((el) => {
    if (parseInt(stdData.level.toString()) === 4) {
      return (
        el.children[el.children.length - 1].createAt > "2024-05-01 00:00:00" &&
        (el.children[el.children.length - 1].status === "approve1" ||
          el.children[el.children.length - 1].status === "edited")
      );
    } else {
      return (
        el.children[el.children.length - 1].status === "approve1" ||
        el.children[el.children.length - 1].status === "edited"
      );
    }
  });

  // console.log(loaderData.history);

  let totalScore: number = 100;

  filteredCases.forEach((el) => {
    const elScore = el.children[el.children.length - 1].score || "0";
    if (el.children[el.children.length - 1].type === "deduct") {
      totalScore = totalScore - parseInt(elScore);
    } else {
      totalScore = totalScore + parseInt(elScore);
    }
  });

  const totalCase = filteredCases.length;

  const baseValue: TCase = {
    caseId: "CWS00000000",
    detail: "คะแนนพื้นฐาน",
    children: [
      {
        status: "approve1",
        score: "100",
        type: "add",
        createAt: "0000-00-00 00:00:00",
      },
    ],
  };

  // console.log(filteredCases);
  return (
    <div className="flex flex-col gap-3">
      <Navbar />
      <PersonalInfo
        stdData={stdData}
        totalScore={totalScore}
        totalCase={totalCase}
      />
      <div className="mt-3">
        <h3 className="text-lg font-bold indent-3">ประวัติ</h3>
        <div className="flex flex-col gap-3 px-3 text-sm">
          <div className="flex flex-row w-full font-bold gap-1">
            {/* <div>ที่</div> */}
            <div className="w-4/12">รหัส</div>
            <div className="w-4/12">รายละเอียด</div>
            <div className="w-2/12">คะแนน</div>
            <div className="w-2/12"></div>
          </div>

          {filteredCases.map((value, index) => (
            <ItemBox value={value} index={index} key={index} />
          ))}
          <ItemBox value={baseValue} />
        </div>
      </div>
    </div>
  );
}
