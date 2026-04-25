import { lazy } from "react";
import PermissionPage from "../pages/Permission/Index";

const Login = lazy(() => import("../pages/login/Login"));
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const UserPage = lazy(() => import("../pages/User/User"));
const MainLayout = lazy(() => import("../layouts/MainLayout"));
const UnAuthorized=lazy(()=>import("../pages/Unauthorized/UnAuthorized"))

export const routes = [
  {
    path: "/login",
    element: Login,
    public: true,
  },
  {
    path: "/unauthorized",
    element: UnAuthorized,
    protected: true,
  },
  {
    path: "/",
    element: MainLayout,
    protected: true,
    children: [
      {
        index: true,
        element: Dashboard,
      },
      {
        path: "users",
        element: UserPage,
        permission: "user:read",
      },
      {
        path: "permission",
        element: PermissionPage,
      },
    ],
  },
];