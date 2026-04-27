import { Controller } from "react-hook-form";
import { FormControlLabel, Switch } from "@mui/material";

const FormSwitch = ({ name, control, label }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControlLabel
          control={
            <Switch
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
            />
          }
          label={label}
        />
      )}
    />
  );
};

export default FormSwitch;