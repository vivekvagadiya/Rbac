import { lazy } from "react";
import PermissionPage from "../pages/Permission/Index";
import ProductPage from "../pages/Product/ProductPage";
import OrderPage from "../pages/Order/OrderPage";

const Login = lazy(() => import("../pages/login/Login"));
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const UserPage = lazy(() => import("../pages/User/User"));
const MainLayout = lazy(() => import("../layouts/MainLayout"));
const UnAuthorized = lazy(() => import("../pages/Unauthorized/UnAuthorized"));
const NotFound = lazy(() => import("../pages/NotFound/NotFound"));
const RolePage = lazy(() => import("../pages/Role/RolePage"));

export const routes = [
  {
    path: "/login",
    element: Login,
    public: true,
  },
  {
    path: "/unauthorized",
    element: UnAuthorized,
    public: true, // ✅ fix
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
        protected: true, // ✅ REQUIRED
        permission: "user.read",
      },
      {
        path: "permissions",
        element: PermissionPage,
        protected: true,
        permission: "permission.read",
      },
      {
        path: "products",
        element: ProductPage,
        protected: true,
        permission: "product.read",
      },
      {
        path: "orders",
        element: OrderPage,
        protected: true,
        permission: "order.read",
      },
      {
        path: "roles",
        element: RolePage,
        protected: true,
        permission: "role.read",
      },
      { path: "*", element: NotFound },
    ],
  },
  { path: "*", element: NotFound },
];
