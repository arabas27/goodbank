import { useSpring, animated } from "@react-spring/web";
import { useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import config from "../../script/config.json";

type TCase = {
  caseId: string;
  detail: string;
  children: {
    createAt: string;
    score: string;
    status: string;
    type: string;
  }[];
};

const DetailItem = ({ value }: { value: TCase }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [height, setHeight] = useState(0);
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

  // work with see more

  // console.log(value);
  const type = value.children[value.children.length - 1].type;
  const score = parseInt(value.children[value.children.length - 1].score);
  return (
    <div className="border-b py-1 border-gray-300 text-sm">
      <div
        className="flex flex-row text-sm gap-1"
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* <div className="flex flex-col w-1/12">{index + 1}</div> */}
        <div className="flex flex-col w-4/12">{value.caseId}</div>
        <div className="flex flex-col w-4/12">{value.detail}</div>
        <div
          className={`flex flex-col w-2/12 font-bold ${
            type === "add"
              ? "text-green-600"
              : type === "deduct"
              ? "text-red-600"
              : "text-black"
          }`}
        >
          {`${type === "deduct" ? "-" : ""}${score}`}
        </div>
        <div className="flex flex-col justify-end w-2/12">
          <div className="text-blue-500">{isOpen ? "น้อยลง" : "เพิ่มเติม"}</div>
        </div>
      </div>
      {isOpen && (
        <animated.div
          className="overflow-y-auto indent-3"
          /* className="flex flex-col indent-3" */ style={{ ...springs }}
        >
          {value.children.map((selfValue, index) => (
            <div className="flex flex-row justify-between" key={index}>
              <div>
                {selfValue.status === "approve1"
                  ? "อนุมัติ"
                  : selfValue.status === "processed"
                  ? "ดำเนินการ"
                  : selfValue.status === "edited"
                  ? "ปรับปรุง"
                  : "ลบ"}
              </div>
              <div>{selfValue.createAt}</div>
            </div>
          ))}
        </animated.div>
      )}
    </div>
  );
};

export default function SelfInfomation() {
  // manage loader data
  const { std_data, history } = useLoaderData() as {
    std_data: {
      title: string;
      firstname: string;
      lastname: string;
      std_id: string;
      level: number;
      section: number;
    };
    history: {
      case_id: string;
      create_at: string;
      process_status: string;
      scdetail: string;
      ssdetail: string;
      type: "add" | "deduct" | "processed";
      score: number;
    }[];
  };

  if (!std_data) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-row justify-center items-center mt-20">
          <h3 className="text-xl font-bold">- ไม่พบข้อมูลที่ค้นหา -</h3>
        </div>
        <div className="flex flex-row  items-center justify-center">
          <Link
            className="bg-blue-500 text-white px-3 py-2 rounded-xl font-bold"
            to={"/searchStudent"}
          >
            ย้อนกลับ
          </Link>
        </div>
      </div>
    );
  }

  /* if (!history || history === undefined || history.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-row justify-center items-center mt-20">
          <h3 className="text-xl font-bold">- ไม่พบข้อมูลที่ค้นหา -</h3>
        </div>
        <div className="flex flex-row  items-center justify-center">
          <Link
            className="bg-blue-500 text-white px-3 py-2 rounded-xl font-bold"
            to={"/searchStudent"}
          >
            ย้อนกลับ
          </Link>
        </div>
      </div>
    );
  } */

  // make unique case id
  const cases: TCase[] = [];
  let filteredCases;
  let totalScore: number = 100;

  history.forEach((value, index, self) => {
    const uniqueCaseIndex = self.findIndex(
      (selfValue) => selfValue.case_id === value.case_id
    );

    if (uniqueCaseIndex === index) {
      cases.push({
        caseId: value.case_id,
        detail: value.scdetail || value.ssdetail,
        children: [
          {
            status: value.process_status,
            score: value.score.toString(),
            type: value.type,
            createAt: value.create_at,
          },
        ],
      });
    } else {
      const matchedIndex = cases.findIndex(
        (selfValue) => selfValue.caseId === value.case_id
      );

      cases[matchedIndex].children.push({
        status: value.process_status,
        createAt: value.create_at,
        type: value.type,
        score: value.score.toString(),
      });
    }
  });

  // filter only approve1
  filteredCases = cases.filter(
    (value) =>
      value.children[value.children.length - 1].status == "approve1" ||
      value.children[value.children.length - 1].status == "edited"
  );
  // console.log(parseInt(std_data.level.toString()) === 4);
  if (parseInt(std_data.level.toString()) === 4) {
    filteredCases = filteredCases.filter((element) => {
      const startData = Date.parse(config.startDate);
      const elDate = Date.parse(
        element.children[element.children.length - 1].createAt
      );

      // console.log(startData + " " + elDate);

      return elDate > startData;
    });
  }
  // console.log(filteredCases);
  // count total score

  filteredCases.forEach((value) => {
    if (value.children[value.children.length - 1].type === "add") {
      totalScore += parseInt(value.children[value.children.length - 1].score);
    } else if (value.children[value.children.length - 1].type === "deduct") {
      totalScore -= parseInt(value.children[value.children.length - 1].score);
    }
  });

  /** ---------------------------- */

  const baseValue: TCase = {
    caseId: "CWS00000000",
    detail: "คะแนนพื้นฐาน",
    children: [
      {
        status: "approve1",
        type: "add",
        score: "100",
        createAt: "0000-00-00 00:00:00",
      },
    ],
  };

  return (
    <>
      <div className="mx-3 my-6">
        <Link
          className="bg-blue-500 text-white px-3 py-2 rounded-xl font-bold"
          to={"/searchStudent"}
        >
          ย้อนกลับ
        </Link>
      </div>
      <div className="flex flex-col gap-2 m-3 px-3 pt-3 pb-1 bg-gray-100 rounded">
        <h3 className="text-xl font-bold">ข้อมูลบุคคล</h3>
        <div className="flex flex-col bg-white grow rounded p-3">
          <div className="flex flex-row gap-3">
            <div>ชื่อ-สกุล</div>
            <div className="font-bold">{`${
              std_data.title === "เด็กชาย"
                ? "ด.ช."
                : std_data.title === "เด็กหญิง"
                ? "ด.ญ."
                : std_data.title
            }${std_data.firstname} ${std_data.lastname}`}</div>
          </div>
          <div className="flex flex-row gap-3">
            <div>รหัสนักเรียน</div>
            <div className="font-bold">{std_data.std_id}</div>
          </div>
          <div className="flex flex-row gap-3">
            <div>ชั้น</div>
            <div className="font-bold">
              ม.{`${std_data.level}/${std_data.section}`}
            </div>
          </div>
          <div className="flex flex-row gap-3">
            <div>คะแนนรวม</div>
            <div
              className={`font-bold ${
                totalScore > 0
                  ? "text-green-600"
                  : totalScore < 0
                  ? "text-red-600"
                  : "text-black"
              }`}
            >
              {totalScore}
            </div>
          </div>
        </div>
        <div className="flex flex-col bg-white grow rounded p-3">
          <div className="flex flex-row text-sm font-bold">
            {/* <div className="flex flex-col w-1/12">ที่</div> */}
            <div className="flex flex-col w-4/12">รหัส</div>
            <div className="flex flex-col w-4/12">รายละเอียด</div>
            <div className="flex flex-col w-2/12">คะแนน</div>
            <div className="flex flex-col w-2/12"></div>
          </div>
          {filteredCases.map((value, index) => (
            <DetailItem value={value} key={index} />
          ))}
          <DetailItem value={baseValue} />
        </div>
      </div>
    </>
  );
}
