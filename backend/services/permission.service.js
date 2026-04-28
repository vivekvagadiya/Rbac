import Permission from "../models/permission.model.js";

export const getPermissions = async () => {
  return await Permission.find().lean();
};
