import Role from "../models/role.model.js";
import Permission from "../models/permission.model.js";
import ApiError from "../utils/ApiError.js";

// CREATE ROLE
export const createRole = async (data) => {
  const { name, permissions } = data;

  const existingRole = await Role.findOne({ name });
  if (existingRole) {
    throw new ApiError(409, "Role already exists");
  }

  if (permissions?.length) {
    const validPermissions = await Permission.find({
      _id: { $in: permissions },
    });

    if (validPermissions.length !== permissions.length) {
      throw new ApiError(400, "Some permissions are invalid");
    }
  }

  return await Role.create({
    name: name.trim(),
    permissions,
  });
};

// GET ROLES
export const getRoles = async () => {
  return await Role.find()
    .populate("permissions", "name module action")
    .lean();
};

// UPDATE ROLE
export const updateRole = async (id, data) => {
  const role = await Role.findById(id);
  if (!role) {
    throw new ApiError(404, "Role not found");
  }

  if (data.name) {
    const existingRole = await Role.findOne({ name: data.name });
    if (existingRole && existingRole._id.toString() !== id) {
      throw new ApiError(409, "Role name already exists");
    }
  }

  if (data.permissions) {
    const validPermissions = await Permission.find({
      _id: { $in: data.permissions },
    });

    if (validPermissions.length !== data.permissions.length) {
      throw new ApiError(400, "Some permissions are invalid");
    }
  }

  return await Role.findByIdAndUpdate(
    id,
    {
      ...data,
      name: data.name?.trim(),
    },
    { new: true }
  ).lean();
};

// DELETE ROLE
export const deleteRole = async (id) => {
  const role = await Role.findById(id);
  if (!role) {
    throw new ApiError(404, "Role not found");
  }

  if (role.name === "admin") {
    throw new ApiError(403, "Cannot delete admin role");
  }

  await Role.findByIdAndDelete(id);

  return { message: "Role deleted successfully" };
};