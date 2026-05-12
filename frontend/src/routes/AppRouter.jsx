import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { routes } from "./routeConfig";
import ProtectedRoute from "./ProtectedRoutes";

const renderRoutes = (routes) => {
  return routes.map((route, index) => {
    const Element = route.element;

    const wrappedElement = route.protected ? (
      <ProtectedRoute permission={route.permission}>
        <Element />
      </ProtectedRoute>
    ) : (
      <Element />
    );

    return (
      <Route
        key={index}
        path={route.path}
        index={route.index}
        element={wrappedElement}
      >
        {route.children && renderRoutes(route.children)}
      </Route>
    );
  });
};

const AppRouter = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>{renderRoutes(routes)}</Routes>
    </Suspense>
  );
};

export default AppRouter;