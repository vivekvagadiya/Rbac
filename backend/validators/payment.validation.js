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
 * CREATE PAYMENT SCHEMA
 */
export const createPaymentSchema = z.object({
  body: z.object({
    items: z
      .array(
        z.object({
          product: objectIdSchema,
          
          quantity: z
            .number({
              invalid_type_error: "Quantity must be a number",
            })
            .int("Quantity must be an integer")
            .min(1, "Quantity must be at least 1"),
          
          name: z
            .string({
              required_error: "Product name is required",
              invalid_type_error: "Product name must be a string",
            })
            .min(1, "Product name is required"),
          
          description: z.string().optional(),
          
          category: z.string().optional(),
          
          price: z
            .number({
              required_error: "Price is required",
              invalid_type_error: "Price must be a number",
            })
            .min(0, "Price must be non-negative"),
        }),
      )
      .min(1, "At least one item is required"),
  }),
});

/**
 * VERIFY PAYMENT SESSION SCHEMA
 */
export const verifyPaymentSessionSchema = z.object({
  params: z.object({
    sessionId: z.string().min(1, "Session ID is required"),
  }),
});
