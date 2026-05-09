import { z } from "zod";
import mongoose from "mongoose";

/**
 * OBJECT ID VALIDATION
 */
const objectIdSchema = z.string().refine(
  (id) => mongoose.Types.ObjectId.isValid(id),
  {
    message: "Invalid ID",
  },
);

/**
 * ORDER STATUS ENUM
 */
const orderStatusEnum = z.enum([
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
]);

/**
 * CREATE ORDER SCHEMA
 */
export const createOrderSchema = z.object({
  body: z.object({
    products: z
      .array(
        z.object({
          product: objectIdSchema,

          quantity: z
            .number({
              required_error: "Quantity is required",
              invalid_type_error: "Quantity must be a number",
            })
            .int("Quantity must be an integer")
            .min(1, "Quantity must be at least 1"),
        }),
      )
      .min(1, "At least one product is required"),
  }),
});

/**
 * GET ORDERS SCHEMA
 */
export const getOrdersSchema = z.object({
  query: z.object({
    page: z
      .string()
      .regex(/^\d+$/, "Page must be a number")
      .optional(),

    limit: z
      .string()
      .regex(/^\d+$/, "Limit must be a number")
      .optional(),

    status: orderStatusEnum.optional(),

    user: objectIdSchema.optional(),

    search: z.string().optional(),
  }),
});

/**
 * UPDATE ORDER STATUS SCHEMA
 */
export const updateOrderStatusSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),

  body: z.object({
    status: orderStatusEnum,
  }),
});

/**
 * REFUND ORDER SCHEMA
 */
export const refundOrderSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

/**
 * GET ORDER BY ID SCHEMA
 */
export const getOrderByIdSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});