import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Chip,
} from "@mui/material";

const ConfirmDeleteDialog = ({
  open,
  onClose,
  onConfirm,
  user,
  loading = false,
}) => {
  if (!user) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Delete User</DialogTitle>

      <DialogContent>
        <Stack spacing={1}>
          <Typography variant="body1">
            Are you sure you want to delete this user?
          </Typography>

          {/* 🔥 User Details */}
          <Typography variant="subtitle2">
            Name: <strong>{user.name}</strong>
          </Typography>

          <Typography variant="subtitle2">
            Email: <strong>{user.email}</strong>
          </Typography>

          {user.role?.name && (
            <Typography variant="subtitle2">
              Role: <Chip size="small" label={user.role.name} />
            </Typography>
          )}

          <Typography variant="caption" color="error">
            This action can be reversed (soft delete).
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>

        <Button
          color="error"
          variant="contained"
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;