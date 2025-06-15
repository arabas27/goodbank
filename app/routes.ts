import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  // admin
  ...prefix("admin", [
    layout("routes/admin/AdminLayout.tsx", [
      route("task", "routes/admin/tasks/Tasks.tsx"),
      route("rank", "routes/admin/rank/Rank.tsx"),
    ]),
  ]),

  // user
  layout("routes/Mainlayout.tsx", [
    index("routes/recordBehavior/RecordBehavior.tsx"),
    route("dashboard", "routes/dashboard/Dashboard.tsx"),
  ]),

  // public
  ...prefix("pub", [
    layout("routes/public/PublicLayout.tsx", [
      index("routes/public/PublicHome.tsx"),
      route("studentView/:stdid", "routes/public/StudentView.tsx"),
    ]),
  ]),

  // login
  layout("routes/BlankLayout.tsx", [route("login", "routes/Login.tsx")]),
] satisfies RouteConfig;
