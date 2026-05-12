import { z } from "zod";
import mongoose from "mongoose";

// =====================================
// Common ObjectId Validator
// =====================================

const objectIdSchema = (field = "ID") =>
  z.string().refine(
    (id) => mongoose.Types.ObjectId.isValid(id),
    {
      message: `Invalid ${field}`,
    }
  );

// =====================================
// Common Email Validator
// =====================================

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Invalid email address");

// =====================================
// Common Password Validator
// =====================================

const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .max(100, "Password too long");

// =====================================
// Common Name Validator
// =====================================

const nameSchema = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name cannot exceed 50 characters");

// =====================================
// Create User Schema
// =====================================

export const createUserSchema = z.object({
  body: z.object({
    name: nameSchema,

    email: emailSchema,

    password: passwordSchema,

    roleId: objectIdSchema("Role ID"),

    isBlocked: z.boolean(),
  }),
});

// =====================================
// Get User By ID Schema
// =====================================

export const getUserByIdSchema = z.object({
  params: z.object({
    id: objectIdSchema("User ID"),
  }),
});

// =====================================
// Delete User Schema
// =====================================

export const deleteUserSchema = z.object({
  params: z.object({
    id: objectIdSchema("User ID"),
  }),
});

// =====================================
// Update User Schema
// =====================================

export const updateUserSchema = z.object({
  params: z.object({
    id: objectIdSchema("User ID"),
  }),

  body: z
    .object({
      name: nameSchema.optional(),

      email: emailSchema.optional(),

      password: passwordSchema.optional(),

      roleId: objectIdSchema("Role ID").optional(),

      isBlocked: z.boolean().optional(),
    })
    .refine(
      (data) => Object.keys(data).length > 0,
      {
        message: "Provide at least one field to update",
      }
    ),
});

// =====================================
// Assign Role Schema
// =====================================

export const assignRoleSchema = z.object({
  params: z.object({
    id: objectIdSchema("User ID"),
  }),

  body: z.object({
    roleId: objectIdSchema("Role ID"),
  }),
});

// =====================================
// Toggle Block Schema
// =====================================

export const toggleBlockSchema = z.object({
  params: z.object({
    id: objectIdSchema("User ID"),
  }),

  body: z.object({
    isBlocked: z.boolean({
      required_error: "isBlocked is required",
    }),
  }),
});

// =====================================
// Get Users Query Schema
// =====================================

export const getUsersSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).optional(),

    limit: z.coerce.number().min(1).max(50).optional(),

    search: z.string().trim().optional(),

    role: z.string().trim().optional(),

    status: z
      .enum(["active", "blocked", "deleted"])
      .optional(),
  }),
});