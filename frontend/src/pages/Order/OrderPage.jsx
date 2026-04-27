import { useState } from "react";
import { PageContainer } from "./styles";
import OrderHeader from "./components/OrderHeader";
import OrderFilters from "./components/OrderFilters";
import OrderTable from "./components/OrderTable";
import OrderViewModal from "./components/OrderViewModal";
import UpdateStatusModal from "./components/UpdateStatusModal";
import RefundModal from "./components/RefundModel";

const OrderPage = () => {
    const [filters, setFilters] = useState({
        search: "",
        status: "",
    });
    const [selectedOrder, setSelectedOrder] = useState(null);

    const [viewOpen, setViewOpen] = useState(false);
    const [statusOpen, setStatusOpen] = useState(false);
    const [refundOpen, setRefundOpen] = useState(false);

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

    return (
        <PageContainer>
            <OrderHeader />
            <OrderFilters filters={filters} setFilters={setFilters} />
            <OrderTable
                filters={filters}
                openView={openView}
                openStatus={openStatus}
                openRefund={openRefund}
            />
            <OrderViewModal
                open={viewOpen}
                onClose={() => setViewOpen(false)}
                order={selectedOrder}
            />

            <UpdateStatusModal
                open={statusOpen}
                onClose={() => setStatusOpen(false)}
                order={selectedOrder}
            />

            <RefundModal
                open={refundOpen}
                onClose={() => setRefundOpen(false)}
                order={selectedOrder}
            />
        </PageContainer>
    );
};

export default OrderPage;