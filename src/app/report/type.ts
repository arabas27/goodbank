export type TData = {
  std_id: string;
  seat_no: number | null;
  title: string | null;
  firstname: string | null;
  lastname: string | null;
  level: number | null;
  section: number | null;
};

export type TReportContext = {
  type: "" | "add" | "deduct";
  setType: React.Dispatch<React.SetStateAction<"" | "add" | "deduct">>;
  selectedStudentID: TData[];
  setSelectedStudentID: React.Dispatch<React.SetStateAction<TData[]>>;
  students: TData[];
  setStudents: React.Dispatch<React.SetStateAction<TData[]>>;
  data: TData[];
  setData?: React.Dispatch<React.SetStateAction<TData[]>>;
};

export type TActionData = {
  data: TData1[];
};

type TData1 = {
  std_id: string;
  name: string;
  status: number;
};
