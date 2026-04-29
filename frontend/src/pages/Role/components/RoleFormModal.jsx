import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  styled,
  alpha,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SecurityIcon from "@mui/icons-material/Security";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import PermissionMatrix from "./PermissionMatrix";

// --- Styled Components ---

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: theme.spacing(3),
    boxShadow: "0 24px 48px rgba(0,0,0,0.1)",
  },
}));

const ModalHeader = styled(DialogTitle)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(3),
  background: alpha(theme.palette.primary.main, 0.02),
}));

const FormSectionLabel = styled(Typography)(({ theme }) => ({
  fontSize: "0.85rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "1px",
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

const StyledActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: alpha(theme.palette.grey[50], 0.5),
}));

// --- Main Component ---

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

  useEffect(() => {
    if (open) {
      reset(
        role
          ? { name: role.name, permissions: role.permissions.map((p) => p._id) }
          : { name: "", permissions: [] }
      );
    }
  }, [role, open, reset]);

  const handlePermissionChange = (updated) => setValue("permissions", updated);

  const submitHandler = (data) => {
    onSubmit({
      name: data.name.trim(),
      permissions: data.permissions,
    });
  };

  return (
    <StyledDialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <ModalHeader>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              p: 1,
              bgcolor: "primary.main",
              borderRadius: 2,
              color: "white",
              display: "flex",
            }}
          >
            <SecurityIcon fontSize="small" />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
              {role ? "Edit Role" : "Create New Role"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Define identity and access permissions
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </ModalHeader>

      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ py: 1 }}>
          <FormSectionLabel>General Information</FormSectionLabel>
          <Controller
            name="name"
            control={control}
            rules={{ required: "Role name is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Role Identifier"
                placeholder="e.g. Content Manager"
                fullWidth
                error={!!errors.name}
                helperText={errors.name?.message}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    backgroundColor: alpha("#000", 0.01),
                  },
                }}
              />
            )}
          />
        </Box>

        <Box sx={{ mt: 4 }}>
          <FormSectionLabel>Access Configuration</FormSectionLabel>
          <Box
            sx={{
              p: 2,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 4,
              bgcolor: alpha("#000", 0.01),
            }}
          >
            <PermissionMatrix
              groupedPermissions={groupedPermissions}
              selectedPermissions={permissions}
              onChange={handlePermissionChange}
            />
          </Box>
        </Box>
      </DialogContent>

      <StyledActions>
        <Button 
          onClick={onClose} 
          sx={{ fontWeight: 600, color: "text.secondary" }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          disableElevation
          onClick={handleSubmit(submitHandler)}
          sx={{
            px: 4,
            borderRadius: 2.5,
            fontWeight: 700,
            textTransform: "none",
          }}
        >
          Save Changes
        </Button>
      </StyledActions>
    </StyledDialog>
  );
};

export default RoleFormModal;