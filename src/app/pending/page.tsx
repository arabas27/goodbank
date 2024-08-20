import Navbar from "@/ui/navbar";
import axios from "axios";
import clsx from "clsx";
import { Suspense, useEffect, useState } from "react";
import { BsBagCheckFill, BsFillTrash3Fill } from "react-icons/bs";
import {
  Await,
  Form,
  useLoaderData,
  useNavigate,
  useSubmit,
} from "react-router-dom";
import { APIBasePath } from "@/script/config.json";
import { TData } from "./type";
import { useAuth } from "@/script/auth/useAuth";
import { useDebouncedCallback } from "use-debounce";
import Loading from "@/ui/Loading";

const Filter = ({
  total,
  limit,
  page,
}: {
  total: number;
  limit: string;
  page: string;
}) => {
  // const loaderData = useLoaderData() as {
  //   total: number;
  //   limit: string;
  //   page: string;
  // };
  const submit = useSubmit();
  const [_limit, setLimit] = useState(limit || "20");
  const [_page, setPage] = useState(page || "1");
  const limitChangeDebounce = useDebouncedCallback((form) => {
    const formData = new FormData(form);
    formData.set("page", "1");
    submit(formData);
  }, 1000);
  const pageChangeDebounce = useDebouncedCallback((form) => {
    const formData = new FormData(form);
    submit(formData);
  }, 1000);

  useEffect(() => {
    setLimit(limit);
  }, [limit]);
  useEffect(() => {
    setPage(page);
  }, [page]);

  const currentLimit = limit || "20";
  const totalPage = Math.ceil(total / parseInt(currentLimit));

  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (parseInt(event.target.value) > 50) {
      setLimit("50");
    } else if (event.target.value === "") {
      setLimit("1");
    } else {
      setLimit(event.target.value);
    }

    limitChangeDebounce(event.currentTarget.form);
  };

  const handlePageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (parseInt(event.target.value) > totalPage) {
      setPage(totalPage.toString());
    } else if (event.target.value === "") {
      setPage("1");
    } else {
      setPage(event.target.value);
    }

    pageChangeDebounce(event.currentTarget.form);
  };

  return (
    <Form
      className="flex flex-row justify-between items-center mx-3 p-3 bg-gray-50 shadow shadow-gray-300 rounded-lg"
      role="search"
    >
      <div className="flex flex-col">
        <div className="flex flex-row justify-center items-center gap-1">
          <span>แสดง</span>
          <input
            className="bg-white w-12 outline outline-1 rounded outline-gray-300 focus:outline-gray-500 px-2 py-1 text-right"
            type="number"
            name="limit"
            value={_limit}
            onChange={handleLimitChange}
            onClick={(e) => {
              e.currentTarget.select();
            }}
          />
          <span>รายการ</span>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex flex-row items-center justify-center gap-1">
          <input
            className="bg-white w-12 outline outline-1 rounded outline-gray-300 focus:outline-gray-500 px-2 py-1 text-right"
            type="number"
            name="page"
            value={_page}
            onChange={handlePageChange}
            onClick={(e) => {
              e.currentTarget.select();
            }}
          />
          <span>/ {totalPage} หน้า</span>
        </div>
      </div>
    </Form>
  );
};

const Input = ({
  type,
  name,
  placeHolder,
  extraClass = "",
  value,
  onChange,
  onFocus,
}: {
  type: string;
  name: string;
  placeHolder?: string;
  extraClass?: string;
  value: number;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
}) => {
  return (
    <input
      className={`flex w-16 rounded-sm p-1 ${extraClass}`}
      type={type}
      name={name}
      id={name}
      placeholder={placeHolder}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
    />
  );
};

const Toggler = ({
  name,
  isChecked,
  onChange,
}: {
  name: string;
  isChecked: boolean;
  onChange: React.ChangeEventHandler;
}) => {
  return (
    <label
      className={clsx(
        "flex flex-col items-center justify-center w-24 rounded py-1 text-xl font-bold",
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
        onChange={onChange}
      />
      {isChecked ? "บวก" : "ลบ"}
    </label>
  );
};

const ReportItem = ({ name, data }: { name: string; data: TData }) => {
  const { user } = useAuth();
  const [isChecked, setIsChecked] = useState(
    data.type === "add" ? true : data.type === "deduct" ? false : true
  );
  const [score, setScore] = useState<number>(data.score);
  const navigate = useNavigate();
  const fullDate = data.create_at.split(" ");
  const date: string[] = fullDate[0].split("-");
  const month = [
    "ม.ค.",
    "ก.พ.",
    "มี.ค.",
    "เม.ย.",
    "พ.ค.",
    "มิ.ย.",
    "ก.ค.",
    "ส.ต.",
    "ก.ย.",
    "ต.ค.",
    "พ.ค.",
    "ธ.ค.",
  ][Number(date[1]) - 1];

  const handleCheckedChanged = () => {
    setIsChecked(!isChecked);
  };

  useEffect(() => {
    setIsChecked(
      data.type === "add" ? true : data.type === "deduct" ? false : true
    );
    setScore(data.score);
  }, [data]);

  return (
    <div
      className={clsx("border rounded p-2 shadow shadow-gray-500", {
        "bg-green-100 border-green-500": isChecked,
        "bg-red-100 border-red-500": !isChecked,
      })}
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
        <div className="flex flex-row items-center gap-1">
          {/* delete button */}
          <button
            className="flex flex-col bg-red-600 rounded-lg text-white"
            onClick={() => {
              const cf = confirm(`ยืนยันการลบรายการ ${data.case_id}`);
              if (cf) {
                (async () => {
                  await axios({
                    method: "DELETE",
                    url: `${APIBasePath}/deleteCaseByID.php`,
                    data: {
                      id: data.id,
                      doer_id: JSON.parse(user as string)["username"],
                    },
                    headers: {
                      "Content-Type":
                        "application/x-www-form-urlencoded; charset=UTF-8",
                      "Access-Control-Allow-Origin": "*",
                    },
                  })
                    // .then((response) => response)
                    .catch((err) => console.log(err))
                    .finally(() => {
                      navigate(".", { replace: true });
                    });
                })();
              }
            }}
          >
            <BsFillTrash3Fill className="w-6 h-6 m-2" />
          </button>
          <div className="flex flex-col">
            <div>{data.case_id}</div>
            <div>{`${date[2]} ${month} ${Number(date[0]) + 543} - ${
              fullDate[1]
            }`}</div>
          </div>
        </div>
        <div className="flex flex-col">
          {/* score input */}
          <div className="text-sm">คะแนน</div>
          <Input
            type="number"
            name={`score${name}`}
            extraClass={clsx("border font-bold outline-0", {
              "bg-green-50 text-green-900 border-green-500 focus:outline-1 focus:outline-green-500":
                isChecked,
              "bg-red-50 text-red-900 border-red-500 focus:outline-1 focus:outline-red-500":
                !isChecked,
            })}
            value={score}
            onFocus={(e) => {
              e.target.select();
            }}
            onChange={(e) => {
              setScore(Number(e.target.value));
            }}
          />
        </div>
      </div>
      <div className="flex flex-row justify-between items-center">
        <div className="text-lg">{`${data.title}${data.firstname} ${data.lastname}`}</div>
        <div>{`ม.${data.level}/${data.section}`}</div>
      </div>
      <div className="flex flex-row py-1">
        <div>{data.detail}</div>
      </div>
      <div className="flex flex-row justify-between">
        <Toggler
          name={`type${name}`}
          isChecked={isChecked}
          onChange={handleCheckedChanged}
        />
        {/* approve button */}
        <button
          className="flex flex-row gap-1 items-center justify-center px-3 py-1 bg-blue-500 text-white rounded"
          onClick={() => {
            let cf = true;
            if (score === 0) {
              cf = confirm("ยืนยันอนุมัติ 0 คะแนน");
            } else {
              cf = true;
            }

            cf &&
              (async () => {
                await axios({
                  method: "UPDATE",
                  url: `${APIBasePath}/approveReport.php`,
                  data: {
                    id: data.id,
                    score: score,
                    doer_id: JSON.parse(user as string)["username"],
                    type: isChecked ? "add" : "deduct",
                  },
                  headers: {
                    "Content-Type":
                      "application/x-www-form-urlencoded; charset=UTF-8",
                    "Access-Control-Allow-Origin": "*",
                  },
                })
                  // .then((response) => console.log(response))
                  .catch((err) => console.log(err))
                  .finally(() => navigate(".", { replace: true }));
              })();
          }}
        >
          <BsBagCheckFill className="w-6 h-6" />
          <span className="font-bold">อนุมัติ</span>
        </button>
      </div>
    </div>
  );
};

export default function Pending() {
  const loaderData = useLoaderData() as {
    response: { data: TData[]; limit: string; page: string; total: number };
  };
  const { response } = loaderData;

  // console.log(response);

  return (
    <div className="flex flex-col gap-3 w-full">
      <Navbar />
      <Suspense fallback={<Loading />}>
        <Await resolve={response}>
          <Filter
            total={response.total}
            page={response.page}
            limit={response.limit}
          />
          <div className="flex flex-col gap-3 px-3">
            {response.data.map((data, i) => (
              <ReportItem name={i.toString()} data={data} key={i} />
            ))}
          </div>
        </Await>
      </Suspense>
    </div>
  );
}
