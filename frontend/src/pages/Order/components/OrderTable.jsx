import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    Paper,
    Tooltip,
    TablePagination,
    CircularProgress,
    Box,
    Typography,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import ReplyIcon from "@mui/icons-material/Reply";

import OrderStatusChip from "./OrderStatusChip";

const OrderTable = ({
    orders = [],
    loading,
    openView,
    openStatus,
    openRefund,
    page,
    handleChangePage,
    rowsPerPage,
    handleChangeRowsPerPage,
    total,
}) => {
    return (
        <Paper>
            {/* 🔄 Loading State */}
            {loading ? (
                <Box sx={{ p: 4, textAlign: "center" }}>
                    <CircularProgress />
                </Box>
            ) : orders.length === 0 ? (
                /* 📭 Empty State */
                <Box sx={{ p: 4, textAlign: "center" }}>
                    <Typography variant="h6" color="text.secondary">
                        No orders found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Try adjusting filters or search
                    </Typography>
                </Box>
            ) : (
                <>
                    {/* 📊 Table */}
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
                                        <TableCell>{order.productsCount}</TableCell>
                                        <TableCell>₹{order.totalAmount}</TableCell>

                                        <TableCell>
                                            <OrderStatusChip status={order.status} />
                                        </TableCell>

                                        <TableCell>
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </TableCell>

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

                    {/* 📄 Pagination */}
                    <TablePagination
                        component="div"
                        count={total || 0}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                    />
                </>
            )}
        </Paper>
    );
};

export default OrderTable;