import { z } from "zod";
import mongoose from "mongoose";

// ==============================
// Common ObjectId Validator
// ==============================

const objectIdSchema = z.string().refine(
  (id) => mongoose.Types.ObjectId.isValid(id),
  {
    message: "Invalid ObjectId",
  }
);

// ==============================
// Create Role Schema
// ==============================

export const createRoleSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Role name must be at least 2 characters")
      .max(50, "Role name cannot exceed 50 characters"),

    permissions: z
      .array(objectIdSchema)
      .optional()
      .default([]),
  }),
});

// ==============================
// Update Role Schema
// ==============================

export const updateRoleSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),

  body: z
    .object({
      name: z
        .string()
        .trim()
        .min(2, "Role name must be at least 2 characters")
        .max(50, "Role name cannot exceed 50 characters")
        .optional(),

      permissions: z.array(objectIdSchema).optional(),
    })
    .refine(
      (data) =>
        data.name !== undefined ||
        data.permissions !== undefined,
      {
        message: "Provide at least one field to update",
      }
    ),
});

// ==============================
// Delete Role Schema
// ==============================

export const deleteRoleSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

// ==============================
// Get Single Role Schema
// ==============================

export const getRoleByIdSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});