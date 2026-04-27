import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Paper,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import OrderStatusChip from "./OrderStatusChip";

// Dummy data (replace with API later)
const orders = [
  {
    _id: "ORD001",
    user: { name: "John Doe" },
    products: [{}, {}],
    totalAmount: 1200,
    status: "pending",
    createdAt: "2026-04-25",
  },
  {
    _id: "ORD002",
    user: { name: "Jane Smith" },
    products: [{}],
    totalAmount: 800,
    status: "delivered",
    createdAt: "2026-04-24",
  },
];

const OrderTable = () => {
  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Items</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Date</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {orders.map((order) => (
            <TableRow key={order._id}>
              <TableCell>{order._id}</TableCell>
              <TableCell>{order.user?.name}</TableCell>
              <TableCell>{order.products.length}</TableCell>
              <TableCell>₹{order.totalAmount}</TableCell>
              <TableCell>
                <OrderStatusChip status={order.status} />
              </TableCell>
              <TableCell>{order.createdAt}</TableCell>
              <TableCell align="right">
                <IconButton>
                  <VisibilityIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default OrderTable;