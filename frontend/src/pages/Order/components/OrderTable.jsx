import { useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Paper,
  Tooltip,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import ReplyIcon from "@mui/icons-material/Reply";
import OrderStatusChip from "./OrderStatusChip";

// Dummy data
const orders = [
  {
    _id: "ORD001",
    user: { name: "John Doe" },
    products: [{}, {}],
    totalAmount: 1200,
    status: "pending",
    createdAt: "2026-04-25",
    isRefunded: false,
  },
  {
    _id: "ORD002",
    user: { name: "Jane Smith" },
    products: [{}],
    totalAmount: 800,
    status: "delivered",
    createdAt: "2026-04-24",
    isRefunded: false,
  },
];

const OrderTable = ({openView, openStatus, openRefund}) => {
  

  return (
    <>
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
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {orders.map((order) => {
              const isDelivered = order.status === "delivered";
              const isCancelled = order.status === "cancelled";

              return (
                <TableRow key={order._id}>
                  <TableCell>{order._id}</TableCell>
                  <TableCell>{order.user?.name}</TableCell>
                  <TableCell>{order.products.length}</TableCell>
                  <TableCell>₹{order.totalAmount}</TableCell>
                  <TableCell>
                    <OrderStatusChip status={order.status} />
                  </TableCell>
                  <TableCell>{order.createdAt}</TableCell>

                  <TableCell align="center">
                    {/* View */}
                    <Tooltip title="View Order">
                      <IconButton onClick={() => openView(order)}>
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>

                    {/* Update Status */}
                    <Tooltip title="Update Status">
                      <span>
                        <IconButton
                          onClick={() => openStatus(order)}
                          disabled={isDelivered || isCancelled}
                        >
                          <EditIcon />
                        </IconButton>
                      </span>
                    </Tooltip>

                    {/* Refund */}
                    <Tooltip title="Refund">
                      <span>
                        <IconButton
                          color="error"
                          onClick={() => openRefund(order)}
                          disabled={!isDelivered || order.isRefunded}
                        >
                          <ReplyIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>

      {/* Modals */}

    
    </>
  );
};

export default OrderTable;