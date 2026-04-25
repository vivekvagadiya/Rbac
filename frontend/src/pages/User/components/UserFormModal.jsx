import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";


const FormContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  marginTop: "8px",
});


const UserFormModal = ({
  open,
  onClose,
  onSubmit,
  roles = [],
  loading = false,
  initialData = null, // for edit
}) => {
  const isEdit = Boolean(initialData);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    roleId: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        name: initialData.name || "",
        email: initialData.email || "",
        password: "",
        roleId: initialData?.role?._id || "",
      });
    } else {
      setForm({
        name: "",
        email: "",
        password: "",
        roleId: "",
      });
    }
  }, [initialData, open]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";

    if (!isEdit && !form.password) {
      newErrors.password = "Password is required";
    }

    if (!form.roleId) newErrors.roleId = "Role is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const payload = {
      name: form.name,
      email: form.email,
      roleId: form.roleId,
      ...(form.password ? { password: form.password } : {}),
    };

    onSubmit(payload);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {isEdit ? "Edit User" : "Create User"}
      </DialogTitle>

      <DialogContent>
        <FormContainer>
          <TextField
            label="Name"
            value={form.name}
            onChange={handleChange("name")}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
          />

          <TextField
            label="Email"
            value={form.email}
            onChange={handleChange("email")}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
          />

          {!isEdit && (
            <TextField
              label="Password"
              type="password"
              value={form.password}
              onChange={handleChange("password")}
              error={!!errors.password}
              helperText={errors.password}
              fullWidth
            />
          )}

          <TextField
            select
            label="Role"
            value={form.roleId}
            onChange={handleChange("roleId")}
            error={!!errors.roleId}
            helperText={errors.roleId}
            fullWidth
          >
            {roles.map((role) => (
              <MenuItem key={role._id} value={role._id}>
                {role.name}
              </MenuItem>
            ))}
          </TextField>
        </FormContainer>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
        >
          {isEdit ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserFormModal;