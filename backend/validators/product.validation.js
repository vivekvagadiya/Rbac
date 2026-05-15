import { z } from "zod";
import mongoose from "mongoose";

/**
 * OBJECT ID VALIDATION
 */
const objectIdSchema = z.string().refine(
  (id) => mongoose.Types.ObjectId.isValid(id),
  {
    message: "Invalid product id",
  },
);

/**
 * CREATE PRODUCT SCHEMA
 */
export const createProductSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Product name must be at least 2 characters")
      .max(100, "Product name too long"),

    description: z
      .string()
      .max(500, "Description too long")
      .optional(),

    price: z
      .number({
        required_error: "Price is required",
        invalid_type_error: "Price must be a number",
      })
      .min(0, "Price cannot be negative"),

    category: z
      .string()
      .trim()
      .min(1, "Category is required"),

    stock: z
      .number({
        invalid_type_error: "Stock must be a number",
      })
      .min(0, "Stock cannot be negative")
      .optional(),

    isActive: z.boolean().optional(),
  }),
});

/**
 * UPDATE PRODUCT SCHEMA
 */
export const updateProductSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),

  body: z
    .object({
      name: z
        .string()
        .trim()
        .min(2, "Product name must be at least 2 characters")
        .max(100, "Product name too long")
        .optional(),

      description: z
        .string()
        .max(1000, "Description too long")
        .optional(),

      price: z
        .number({
          invalid_type_error: "Price must be a number",
        })
        .min(0, "Price cannot be negative")
        .optional(),

      category: z
        .string()
        .trim()
        .min(1, "Category cannot be empty")
        .optional(),

      stock: z
        .number({
          invalid_type_error: "Stock must be a number",
        })
        .min(0, "Stock cannot be negative")
        .optional(),

      isActive: z.boolean().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "No valid fields to update",
    }),
});

/**
 * DELETE PRODUCT SCHEMA
 */
export const deleteProductSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

/**
 * GET PRODUCTS SCHEMA
 */
export const getProductsSchema = z.object({
  query: z.object({
    page: z
      .string()
      .regex(/^\d+$/, "Page must be a number")
      .optional(),

    limit: z
      .string()
      .regex(/^\d+$/, "Limit must be a number")
      .optional(),

    search: z.string().optional(),

    category: z.string().optional(),

    isActive: z
      .enum(["true", "false"])
      .optional(),
  }),
});