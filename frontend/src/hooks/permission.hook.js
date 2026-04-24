import { useContext, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";

const usePermission = () => {
  const { user } = useContext(AuthContext);

  const permissionList = useMemo(() => {
    return user?.role?.permissions?.map((p) => p.name) || [];
  }, [user]);

  const hasPermission = (perm) => {
    return permissionList.includes(perm);
  };

  const hasModuleAccess = (module) => {
    return permissionList.some((p) => p.startsWith(module + ":"));
  };

  return {
    hasPermission,
    hasModuleAccess,
    permissions: permissionList,
  };
};

export default usePermission;