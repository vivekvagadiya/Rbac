import { TextField } from "@mui/material";
import { Controller } from "react-hook-form";

const FormInput = ({
  name,
  control,
  label,
  type = "text",
  rules = {},
  ...props
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          label={label}
          type={type}
          error={!!error}
          helperText={error?.message}
          {...props}
        />
      )}
    />
  );
};

export default FormInput;