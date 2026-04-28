import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import PermissionMatrix from "./PermissionMatrix";

const RoleFormModal = ({ open, onClose, groupedPermissions, role, onSubmit }) => {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      permissions: [],
    },
  });

  const permissions = watch("permissions");

  // ✅ Reset form when modal opens or role changes
  useEffect(() => {
    if (role) {
      reset({
        name: role.name,
        permissions: role.permissions.map((p) => p._id),
      });
    } else {
      reset({
        name: "",
        permissions: [],
      });
    }
  }, [role, open, reset]);

  // ✅ Handle permission change
  const handlePermissionChange = (updatedPermissions) => {
    setValue("permissions", updatedPermissions);
  };

  const submitHandler = (data) => {
    onSubmit({
      name: data.name.trim(),
      permissions: data.permissions,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {role ? "Edit Role" : "Create Role"}
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          
          {/* Role Name */}
          <Controller
            name="name"
            control={control}
            rules={{
              required: "Role name is required",
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Role Name"
                fullWidth
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />

          <Divider />

          {/* Permissions Section */}
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Permissions
            </Typography>

            <PermissionMatrix
              groupedPermissions={groupedPermissions}
              selectedPermissions={permissions}
              onChange={handlePermissionChange}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

        <Button
          variant="contained"
          onClick={handleSubmit(submitHandler)}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RoleFormModal;