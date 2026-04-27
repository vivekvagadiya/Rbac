import * as yup from "yup";

export const userSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),

  email: yup
    .string()
    .trim()
    .email("Invalid email format")
    .required("Email is required"),

  password: yup.string().when("$isEdit", {
    is: false,
    then: (schema) =>
      schema
        .required("Password is required")
        .min(6, "Password must be at least 6 characters")
        .max(100, "Password cannot exceed 100 characters"),
    otherwise: (schema) => schema.notRequired(),
  }),

  roleId: yup
    .string()
    .required("Role is required"),
});