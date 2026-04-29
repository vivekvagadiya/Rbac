import { yupResolver } from "@hookform/resolvers/yup";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  Typography,
  styled,
  alpha,
  Divider,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import { useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { userSchema } from "./helper";
import FormInput from "../../../components/form/FormInput";
import FormSelect from "../../../components/form/FormSelect";
import FormSwitch from "../../../components/form/FormSwitch";

// --- Styled Components ---

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: theme.spacing(3),
    padding: theme.spacing(1),
  },
}));

const FormHeader = styled(DialogTitle)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(2, 3),
}));

const SectionLabel = styled(Typography)(({ theme }) => ({
  fontSize: "0.75rem",
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: "1px",
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
  marginTop: theme.spacing(1),
}));

const InputGroup = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2.5),
  padding: theme.spacing(1, 0),
}));

// --- Logic & Constants ---

const defaultValues = {
  name: "",
  email: "",
  password: "",
  roleId: "",
  isBlocked: false,
};

const UserFormModal = ({
  open,
  onClose,
  onSubmit,
  loading = false,
  initialData = null,
  roles = [],
}) => {
  const isEdit = useMemo(() => !!initialData?._id, [initialData]);

  const {
    reset,
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    resolver: yupResolver(userSchema),
    defaultValues,
    context: { isEdit },
    mode: "onChange",
  });

  useEffect(() => {
    if (open) {
      reset(
        initialData
          ? { ...defaultValues, ...initialData, roleId: initialData?.role?._id, password: "" }
          : defaultValues
      );
    }
  }, [open, initialData, reset]);

  const roleOptions = roles.map((role) => ({
    label: role.name,
    value: role._id,
  }));

  const onFormSubmit = (data) => {
    const payload = {
      name: data.name,
      email: data.email,
      roleId: data.roleId,
      ...(data.password ? { password: data.password } : {}),
      isBlocked: data.isBlocked,
    };
    onSubmit(payload);
  };

  return (
    <StyledDialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <FormHeader>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              p: 1.2,
              borderRadius: 2,
              bgcolor: alpha("#6366f1", 0.1),
              color: "#6366f1",
              display: "flex",
            }}
          >
            {isEdit ? <ManageAccountsRoundedIcon /> : <PersonAddAlt1RoundedIcon />}
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={800}>
              {isEdit ? "Account Settings" : "New User Account"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {isEdit ? "Modify user profile and permissions" : "Register a new user to the platform"}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseRoundedIcon />
        </IconButton>
      </FormHeader>

      <DialogContent sx={{ py: 1 }}>
        <InputGroup>
          <Box>
            <SectionLabel>Personal Information</SectionLabel>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
               {/* Name and Email side by side on wider screens */}
              <FormInput control={control} name="name" label="Full Name" />
              <FormInput control={control} name="email" label="Email Address" />
            </Box>
          </Box>

          <Divider sx={{ borderStyle: "dashed" }} />

          <Box>
            <SectionLabel>Security & Role</SectionLabel>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <FormSelect
                control={control}
                name="roleId"
                label="Assigned Role"
                options={roleOptions}
              />
              
              {!isEdit && (
                <FormInput
                  control={control}
                  name="password"
                  label="Temporary Password"
                  type="password"
                />
              )}

              <Box 
                sx={{ 
                  p: 2, 
                  borderRadius: 3, 
                  bgcolor: alpha("#000", 0.02),
                  border: `1px solid ${alpha("#000", 0.05)}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Box>
                    <Typography variant="body2" fontWeight={700}>Block User Access</Typography>
                    <Typography variant="caption" color="text.secondary">Prevent this user from logging in</Typography>
                </Box>
                <FormSwitch control={control} name="isBlocked" label="" />
              </Box>
            </Box>
          </Box>
        </InputGroup>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button 
          onClick={onClose} 
          disabled={loading}
          sx={{ fontWeight: 700, color: "text.secondary" }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          disableElevation
          onClick={handleSubmit(onFormSubmit)}
          disabled={loading || !isValid}
          sx={{
            borderRadius: 2.5,
            px: 4,
            py: 1,
            fontWeight: 800,
            textTransform: "none",
            boxShadow: '0 8px 16px rgba(99, 102, 241, 0.2)'
          }}
        >
          {loading ? "Processing..." : isEdit ? "Save Changes" : "Create Account"}
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default UserFormModal;