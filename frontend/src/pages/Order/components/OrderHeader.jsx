import { Typography, Button } from "@mui/material";
import { HeaderContainer } from "../styles";

const OrderHeader = () => {
  return (
    <HeaderContainer>
      <Typography variant="h5" fontWeight={600}>
        Orders
      </Typography>

      {/* Future: export / refresh */}
      <Button variant="contained">Refresh</Button>
    </HeaderContainer>
  );
};

export default OrderHeader;