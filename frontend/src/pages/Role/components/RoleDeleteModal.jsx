import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  TextField,
} from "@mui/material";
import { useState } from "react";

const RoleDeleteModal = ({ open, onClose, role, onDelete }) => {
  const [confirmText, setConfirmText] = useState("");

  const isValid = confirmText === role?.name;

  const handleDelete = () => {
    if (!isValid) return;
    onDelete(role._id);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      {/* 🔴 Title */}
      <DialogTitle sx={{ fontWeight: 600, color: "error.main" }}>
        Delete Role
      </DialogTitle>

      {/* 📄 Content */}
      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={2}>
          
          {/* Warning */}
          <Alert severity="error">
            This action is permanent and cannot be undone.
          </Alert>

          {/* Role Info */}
          <Typography>
            You are about to delete the role:
          </Typography>

          <Box
            sx={{
              p: 2,
              bgcolor: "#f5f5f5",
              borderRadius: "8px",
              fontWeight: 600,
            }}
          >
            {role?.name}
          </Box>

          {/* Impact */}
          <Typography variant="body2" color="text.secondary">
            Users assigned to this role may lose access to certain features.
          </Typography>

          {/* Confirmation Input */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Type <strong>{role?.name}</strong> to confirm:
            </Typography>

            <TextField
              fullWidth
              size="small"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Enter role name"
            />
          </Box>
        </Box>
      </DialogContent>

      {/* 🔘 Actions */}
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

        <Button
          variant="contained"
          color="error"
          disabled={!isValid}
          onClick={handleDelete}
        >
          Delete Role
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RoleDeleteModal;