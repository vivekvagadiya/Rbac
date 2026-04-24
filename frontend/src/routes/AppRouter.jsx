import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { routes } from "./routeConfig";
import ProtectedRoute from "./ProtectedRoutes";

const renderRoutes = (routes) => {
  return routes.map((route, index) => {
    const Element = route.element;

    if (route.children) {
      return (
        <Route
          key={index}
          path={route.path}
          element={
            route.protected ? (
              <ProtectedRoute>
                <Element />
              </ProtectedRoute>
            ) : (
              <Element />
            )
          }
        >
          {renderRoutes(route.children)}
        </Route>
      );
    }

    return (
      <Route
        key={index}
        path={route.path}
        index={route.index}
        element={
          <Element />
        }
      />
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