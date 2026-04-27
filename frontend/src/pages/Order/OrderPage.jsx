import { useState } from "react";
import { PageContainer } from "./styles";
import OrderHeader from "./components/OrderHeader";
import OrderFilters from "./components/OrderFilters";
import OrderTable from "./components/OrderTable";

const OrderPage = () => {
  const [filters, setFilters] = useState({
    search: "",
    status: "",
  });

  return (
    <PageContainer>
      <OrderHeader />
      <OrderFilters filters={filters} setFilters={setFilters} />
      <OrderTable filters={filters} />
    </PageContainer>
  );
};

export default OrderPage;