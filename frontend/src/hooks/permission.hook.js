import { useContext, useMemo, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";

const usePermission = () => {
  const { user } = useContext(AuthContext);

  // Create clean permission list
  const permissionList = useMemo(() => {
    if (!Array.isArray(user?.role?.permissions)) {
      return [];
    }

    return user.role.permissions
      .map((p) => p?.name)
      .filter(Boolean);
  }, [user]);

  // Check exact permission
  const hasPermission = useCallback(
    (perm) => {
      if (!perm) return false;

      return permissionList.includes(perm);
    },
    [permissionList]
  );

  // Module-level access
  const hasModuleAccess = useCallback(
    (module) => {
      if (!module) return false;

      return permissionList.some((p) =>
        p.startsWith(`${module}.`)
      );
    },
    [permissionList]
  );

  return {
    hasPermission,
    hasModuleAccess,
    permissions: permissionList,
  };
};

export default usePermission;