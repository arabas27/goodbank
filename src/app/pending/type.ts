export type TReportItem = {
  name: string;
  data: TData[];
};

export type TData = {
  id: number;
  case_id: string;
  title: string;
  firstname: string;
  lastname: string;
  level: number;
  section: number;
  type: "deduct" | "add" | "processed";
  score: number;
  detail: string;
  create_at: string;
};
