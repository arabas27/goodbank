import { useState } from "react";
import { useNavigate } from "react-router";

export default function PublicHome() {
  const [stdid, setStdid] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`studentView/${stdid}`);
  };

  return (
    <div className="flex gap-2 items-end justify-center mt-20 w-full max-w-xl mx-auto p-6">
      <label className="flex flex-col w-full">
        ค้นหา
        <input
          type="number"
          value={stdid}
          onChange={(event) => setStdid(event.target.value)}
          placeholder="พิมพ์รหัสนักเรียน"
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
        />
      </label>
      <button
        type="button"
        onClick={handleSearch}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        ค้นหา
      </button>
    </div>
  );
}
