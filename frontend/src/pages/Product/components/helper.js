import * as yup from "yup";

export const productSchema = yup.object().shape({
  name: yup
    .string()
    .trim() // Removes leading/trailing spaces
    .required("Product name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"), // Increased from 15 (15 is very short for products)

  price: yup
    .number()
    .typeError("Price must be a valid number")
    .required("Price is required")
    .positive("Price must be greater than zero") // Prevents negative prices
    .max(99999, "Price exceeds maximum limit")
    .test("is-decimal", "Maximum 2 decimal places allowed", (val) => 
      val !== undefined ? /^\d+(\.\d{1,2})?$/.test(val.toString()) : true
    ),

  category: yup
    .string()
    .required("Please select a category"),

  stock: yup
    .number()
    .typeError("Stock must be a whole number")
    .required("Stock is required")
    .integer("Stock must be a whole number") // Prevents 1.5 items in stock
    .min(0, "Stock cannot be negative") // Changed to 0 in case items are sold out
    .max(10000, "Stock exceeds warehouse capacity"),

  description: yup
    .string()
    .trim()
    .required("Product description is required")
    .min(10, "Description should be at least 10 characters")
    .max(500, "Description cannot exceed 500 characters"),

  isActive: yup
    .boolean()
    .default(true),
});