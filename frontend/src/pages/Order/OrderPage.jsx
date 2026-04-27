import { useEffect, useState } from "react";
import { PageContainer } from "./styles";
import OrderHeader from "./components/OrderHeader";
import OrderFilters from "./components/OrderFilters";
import OrderTable from "./components/OrderTable";
import OrderViewModal from "./components/OrderViewModal";
import UpdateStatusModal from "./components/UpdateStatusModal";
import RefundModal from "./components/RefundModel";
import { getOrders } from "../../api/orders.api";
import { toast } from "react-hot-toast";
import { useDebounce } from "../../hooks/debounce.hook";

const OrderPage = () => {
    const [filters, setFilters] = useState({
        search: "",
        status: "",
    });

    const debouncedSearch = useDebounce(filters.search, 500);

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const [selectedOrder, setSelectedOrder] = useState(null);

    const [viewOpen, setViewOpen] = useState(false);
    const [statusOpen, setStatusOpen] = useState(false);
    const [refundOpen, setRefundOpen] = useState(false);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await getOrders({
                page: page + 1,
                limit: rowsPerPage,
                ...(debouncedSearch && { search: debouncedSearch }),
                ...(filters.status && { status: filters.status }),
            });

            setOrders(response?.data || []);
            setTotal(response?.meta?.total || 0);
        } catch (error) {
            toast.error(error?.message || "Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    //  Trigger on filters + pagination
    useEffect(() => {
        fetchOrders();
    }, [debouncedSearch, filters.status, page, rowsPerPage]);

    // Handlers
    const openView = (order) => {
        setSelectedOrder(order);
        setViewOpen(true);
    };

    const openStatus = (order) => {
        setSelectedOrder(order);
        setStatusOpen(true);
    };

    const openRefund = (order) => {
        setSelectedOrder(order);
        setRefundOpen(true);
    };

    const handleChangePage = (_, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };

    return (
        <PageContainer>
            <OrderHeader
                onRefresh={() => {
                    fetchOrders();
                    setFilters({ search: "", status: "" })
                }}
            />

            <OrderFilters
                filters={filters}
                setFilters={(val) => {
                    setPage(0); // reset page on filter change
                    setFilters(val);
                }}
            />

            <OrderTable
                orders={orders}
                loading={loading}
                openView={openView}
                openStatus={openStatus}
                openRefund={openRefund}
                page={page}
                rowsPerPage={rowsPerPage}
                total={total}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
            />

            {/* Modals */}
            <OrderViewModal
                open={viewOpen}
                onClose={() => setViewOpen(false)}
                orderId={selectedOrder?._id} // IMPORTANT CHANGE
            />

            <UpdateStatusModal
                open={statusOpen}
                onClose={() => setStatusOpen(false)}
                order={selectedOrder}
                onSuccess={fetchOrders} // refresh after update
            />

            <RefundModal
                open={refundOpen}
                onClose={() => setRefundOpen(false)}
                order={selectedOrder}
                onSuccess={fetchOrders}
            />
        </PageContainer>
    );
};

export default OrderPage;