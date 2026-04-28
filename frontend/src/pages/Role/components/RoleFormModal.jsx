import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { useState, useEffect } from "react";
import PermissionMatrix from "./PermissionMatrix";

const RoleFormModal = ({ open, onClose, groupedPermissions, role, onSubmit }) => {
  const [name, setName] = useState("");
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    if (role) {
      setName(role.name);
      setPermissions(role.permissions.map((p) => p._id));
    }
  }, [role]);

  const handleSubmit = () => {
    onSubmit({ name, permissions });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{role ? "Edit Role" : "Create Role"}</DialogTitle>

      <DialogContent>
        <TextField
          label="Role Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2 }}
        />

        <PermissionMatrix
          groupedPermissions={groupedPermissions}
          selectedPermissions={permissions}
          onChange={setPermissions}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RoleFormModal;