import { yupResolver } from "@hookform/resolvers/yup";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useMemo, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { userSchema } from "./helper";
import FormInput from "../../../components/form/FormInput";
import FormSelect from "../../../components/form/FormSelect";
import { getRoles } from "../../../api/role.api";
import FormSwitch from "../../../components/form/FormSwitch";


const FormContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  marginTop: "8px",
});

const defaultValues = {
  name: "",
  email: "",
  password: "",
  roleId: "",
  isBlocked: false
};

const UserFormModal = ({
  open,
  onClose,
  onSubmit,
  loading = false,
  initialData = null,
  roles=[]
}) => {
  const isEdit = useMemo(() => !!initialData?._id, [initialData]);
  console.log('initialData', initialData);


  const {
    reset,
    control,
    handleSubmit,
    formState: { isDirty, isValid },
  } = useForm({
    resolver: yupResolver(userSchema),
    defaultValues,
    context: { isEdit },
    mode: "onChange",
  });

  useEffect(() => {
    if (open) {
      // reset form
      reset(
        initialData
          ? { ...defaultValues, ...initialData, roleId: initialData?.role?._id, password: "" } // don't prefill password
          : defaultValues
      );
    }
  }, [open, initialData, reset]);

  // =========================
  // 🔁 Final Roles Source
  // =========================
  const roleOptions = roles.map((role) => ({
    label: role.name,
    value: role._id,
  }));

  // =========================
  // ✅ Form Submit (controlled)
  // =========================
  const onFormSubmit = (data) => {
    const payload = {
      name: data.name,
      email: data.email,
      roleId: data.roleId,
      ...(data.password ? { password: data.password } : {}),
      isBlocked: data.isBlocked
    };

    onSubmit(payload); // 🔥 keep your API call outside
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {isEdit ? "Edit User" : "Create User"}
      </DialogTitle>

      <DialogContent>
        <FormContainer>
          <FormInput control={control} name="name" label="Name" />

          <FormInput
            control={control}
            name="email"
            label="Email"
            type="email"
          />

          {!isEdit && (
            <FormInput
              control={control}
              name="password"
              label="Password"
              type="password"
            />
          )}

          <FormSelect
            control={control}
            name="roleId"
            label="Role"
            options={roleOptions}
          />

          <FormSwitch
            control={control}
            name="isBlocked"
            label="Blocked"
          />
        </FormContainer>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit(onFormSubmit)}
          disabled={loading || !isValid}
        >
          {isEdit ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserFormModal;