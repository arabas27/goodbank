import { useState } from "react";
import { BsSearch } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

export default function SearchStudent() {
  const [stdId, setStdId] = useState("");
  const [warning, setWarning] = useState("");
  const navigate = useNavigate();

  return (
    <div className="flex flex-col p-3 mt-6">
      <form
        className="bg-gray-100 rounded-lg shadow shadow-gray-300"
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault();
          if (stdId.length !== 5) {
            setWarning("พิมพ์รหัสนักเรียน 5 หลักเพื่อค้นหา");
            return;
          }

          navigate(`/selfInfo/${stdId}`);
        }}
      >
        <div className="flex flex-col p-3">
          <label htmlFor="stdId">รหัสนักเรียน</label>
          <div className="flex flex-row">
            <input
              className="px-3 py-1 border border-gray-500 rounded-s w-full"
              type="text"
              name="stdId"
              id="stdId"
              value={stdId}
              onChange={(e) => {
                setWarning("");
                const isNumber = /^\d+$/.test(e.currentTarget.value);
                if (isNumber) setStdId(e.currentTarget.value);
              }}
            />
            <button className="bg-blue-500 font-bold px-3 rounded-e text-white">
              <div className="flex flex-row gap-1 items-center justify-center">
                <BsSearch />
                ค้นหา
              </div>
            </button>
          </div>
          <div className="flex flex-row mt-1">
            <div className="text-red-600">{warning}</div>
          </div>
        </div>
      </form>
    </div>
  );
}
