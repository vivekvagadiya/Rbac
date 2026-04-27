import { Chip } from "@mui/material";

const statusColorMap = {
  pending: "warning",
  confirmed: "info",
  shipped: "primary",
  delivered: "success",
  cancelled: "error",
};

const OrderStatusChip = ({ status }) => {
  return (
    <Chip
      label={status}
      color={statusColorMap[status] || "default"}
      size="small"
      sx={{ textTransform: "capitalize" }}
    />
  );
};

export default OrderStatusChip;