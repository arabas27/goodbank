import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Root from "./app/Root";
import PersonInfo from "@/app/personinfo/page";
import Pending from "./app/pending/page";
import Edit from "./app/edit/page";
import Editing from "./app/edit/editing/page";
import Report from "./app/report/page";
import Login from "./app/login/page";
import { ProtectedRoute } from "./script/auth/ProtectedRoute";
import { AuthProvider } from "./script/auth/useAuth";
import { ProtectedLoginRoute } from "./script/auth/ProtectedLoginRoute";
import { loader as reportLoader } from "./script/report/loader";
import { loader as editLoader } from "./script/edit/loader";
import { loader as editingLoader } from "./script/editing/loader";
import { action as editingAction } from "./script/editing/action";
import { action as reportAction } from "./script/report/action";
import { loader as pendingLoader } from "./script/pending/loader";
import { loader as personInfoLoader } from "./script/personInfo/loader";
import { loader as stdHistoryLoader } from "./script/std-history/loader";
import { loader as selfInfoLoader } from "./script/selfInfo/loader";
import { loader as memberLoader } from "./script/member/loader";
import { action as memberAction } from "./script/member/action";
import { loader as rankingLoader } from "./script/ranking/loader";
import { action as settingAction } from "./script/setting/action";
// import { action as homeAction } from "./script/home/action";
import StudentHistory from "./app/std-history/page";
// import Home from "./app/home/page";
import Loading from "./ui/Loading";
import SearchStudent from "./app/searchStudent/page";
import SelfInfomation from "./app/selfInfo/page";
import Setting from "./app/setting/page";
// import { withSuspense } from "./script/withSuspense";
// import Loading from "./app/Loading";
import config from "script/config.json";
import Member from "./app/member/page";
// console.log(config);

export const Ranking = lazy(() => import("./app/ranking/page"));

const router = createBrowserRouter(
  [
    {
      path: "/",
      // action: reportAction,
      element: (
        <Suspense fallback={<Loading />}>
          <AuthProvider>
            <Root />
          </AuthProvider>
        </Suspense>
      ),
      children: [
        {
          element: (
            <ProtectedRoute>
              <Outlet />
            </ProtectedRoute>
          ),
          children: [
            {
              index: true,
              element: <Report />,
              loader: reportLoader,
              action: reportAction,
            },
            {
              path: "ranking",
              element: <Ranking />,
              loader: rankingLoader,
              // action: homeAction,
            },
            {
              path: "personInfo",
              element: <PersonInfo />,
              loader: personInfoLoader,
            },
            {
              path: "std-history/:stdid",
              element: <StudentHistory />,
              loader: stdHistoryLoader,
            },
            { path: "pending", element: <Pending />, loader: pendingLoader },
            {
              path: "edit",
              element: <Edit />,
              loader: editLoader,
              children: [
                {
                  path: "editing/:id",
                  element: <Editing />,
                  loader: editingLoader,
                  action: editingAction,
                },
              ],
            },
            {
              path: "setting",
              element: <Setting />,
              action: settingAction,
            },
            {
              path: "member",
              element: <Member />,
              loader: memberLoader,
              action: memberAction,
            },
          ],
        },
        {
          path: "login",
          element: (
            <ProtectedLoginRoute>
              <Login />
            </ProtectedLoginRoute>
          ),
        },
        {
          path: "searchStudent",
          element: <SearchStudent />,
        },
        {
          path: "selfInfo/:stdId",
          element: <SelfInfomation />,
          loader: selfInfoLoader,
        },
      ],
    },
  ],
  {
    basename: `${config.basePath}`,
  }
);

let container: HTMLElement | null = null;

document.addEventListener("DOMContentLoaded", function () {
  if (!container) {
    container = document.getElementById("root");
    const root = ReactDOM.createRoot(container!);
    root.render(
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    );
  }
});
// ReactDOM.createRoot(document.getElementById("root")!).render(
//   <React.StrictMode>
//     <RouterProvider router={router} />
//   </React.StrictMode>
// );
