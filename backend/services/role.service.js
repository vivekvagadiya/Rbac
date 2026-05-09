import Role from "../models/role.model.js";
import Permission from "../models/permission.model.js";
import ApiError, {
  NotFoundError,
  ValidationError,
} from "../utils/ApiError.js";

// CREATE ROLE
export const createRole = async (data) => {
  const name = data.name?.trim();

  const existingRole = await Role.findOne({
    name: { $regex: `^${name}$`, $options: "i" },
  });

  if (existingRole) {
    throw new ApiError(409, "Role already exists");
  }

  if (Array.isArray(data.permissions) && data.permissions.length > 0) {
    const validPermissions = await Permission.find({
      _id: { $in: data.permissions },
    });

    if (validPermissions.length !== data.permissions.length) {
      throw new ValidationError("Some permissions are invalid");
    }
  }

  return await Role.create({
    name,
    permissions: data.permissions || [],
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
    throw new NotFoundError("Role not found");
  }

  // CHECK ROLE NAME DUPLICATE
  if (data.name) {
    const trimmedName = data.name.trim();

    const existingRole = await Role.findOne({
      name: { $regex: `^${trimmedName}$`, $options: "i" },
    });

    if (existingRole && existingRole._id.toString() !== id) {
      throw new ApiError(409, "Role name already exists");
    }

    data.name = trimmedName;
  }

  // VALIDATE PERMISSIONS
  if (Array.isArray(data.permissions)) {
    const validPermissions = await Permission.find({
      _id: { $in: data.permissions },
    });

    if (validPermissions.length !== data.permissions.length) {
      throw new ValidationError("Some permissions are invalid");
    }
  }

  return await Role.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).lean();
};

// DELETE ROLE
export const deleteRole = async (id) => {
  const role = await Role.findById(id);

  if (!role) {
    throw new NotFoundError("Role not found");
  }

  if (role.name.toLowerCase() === "admin") {
    throw new ApiError(403, "Cannot delete admin role");
  }

  await Role.findByIdAndDelete(id);

  return {
    message: "Role deleted successfully",
  };
};