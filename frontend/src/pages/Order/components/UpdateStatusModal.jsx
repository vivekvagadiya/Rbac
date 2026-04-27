import { useState, useEffect } from "react";
import {
  Dialog,
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";

const statusOptions = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

const UpdateStatusModal = ({ open, onClose, order }) => {
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (order) {
      setStatus(order.status);
    }
  }, [order]);

  const handleUpdate = () => {
    console.log("Update status →", status);
    onClose();
  };

  if (!order) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600}>
          Update Status
        </Typography>

        <Typography sx={{ mt: 2 }}>
          Order: <strong>{order._id}</strong>
        </Typography>

        <TextField
          select
          fullWidth
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          sx={{ mt: 2 }}
        >
          {statusOptions.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </TextField>

        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "flex-end",
            gap: 1,
          }}
        >
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained">Update</Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default UpdateStatusModal;