import { Typography, Button } from "@mui/material";
import { HeaderContainer } from "../styles";

const OrderHeader = ({onRefresh}) => {
  return (
    <HeaderContainer>
      <Typography variant="h5" fontWeight={600}>
        Orders
      </Typography>

      {/* Future: export / refresh */}
      <Button variant="contained" onClick={onRefresh}>Refresh</Button>
    </HeaderContainer>
  );
};

export default OrderHeader;