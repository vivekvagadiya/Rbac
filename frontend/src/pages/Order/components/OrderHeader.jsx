import { Typography, Button, Stack, Box, alpha, styled } from "@mui/material";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import CloudDownloadRoundedIcon from "@mui/icons-material/CloudDownloadRounded";

// --- Styled Components ---

const LiveIndicator = styled(Box)(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: "50%",
  backgroundColor: theme.palette.success.main,
  marginRight: theme.spacing(1),
  boxShadow: `0 0 0 2px ${alpha(theme.palette.success.main, 0.2)}`,
}));

// --- Main Component ---

const OrderHeader = ({ onRefresh, loading }) => {
  return (
    <Stack 
      direction="row" 
      sx={{ mb: 3, mt: 1,justifyContent:"space-between",alignItems:'center' }}
    >
      <Box>
        <Stack direction="row" sx={{alignItems:'center'}} spacing={1}>
          <Typography variant="h4" fontWeight={800} color="text.primary" letterSpacing="-0.5px">
            Orders
          </Typography>
          {/* <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              bgcolor: alpha('#4caf50', 0.1), 
              px: 1.5, 
              py: 0.5, 
              borderRadius: 5,
              ml: 1
            }}
          >
            <LiveIndicator />
            <Typography variant="caption" fontWeight={700} color="success.main">
              LIVE SYSTEM
            </Typography>
          </Box> */}
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Monitor, manage, and process customer transactions and refunds.
        </Typography>
      </Box>

      <Stack direction="row" spacing={2}>
        {/* Export Button (Secondary Action) */}
        {/* <Button
          variant="outlined"
          color="inherit"
          startIcon={<CloudDownloadRoundedIcon />}
          sx={{
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 700,
            borderColor: "divider",
            display: { xs: 'none', sm: 'inline-flex' }
          }}
        >
          Export CSV
        </Button> */}

        {/* Refresh Button (Primary Action) */}
        <Button
          variant="contained"
          disableElevation
          onClick={onRefresh}
          disabled={loading}
          startIcon={
            <RefreshRoundedIcon 
              sx={{ 
                animation: loading ? "spin 2s linear infinite" : "none",
                "@keyframes spin": {
                  "0%": { transform: "rotate(0deg)" },
                  "100%": { transform: "rotate(360deg)" },
                }
              }} 
            />
          }
          sx={{
            borderRadius: 3,
            px: 3,
            textTransform: "none",
            fontWeight: 800,
            background: "linear-gradient(45deg, #6366f1 30%, #818cf8 90%)",
            boxShadow: "0 8px 16px -4px rgba(99, 102, 241, 0.5)",
            "&:hover": {
              boxShadow: "0 12px 20px -6px rgba(99, 102, 241, 0.6)",
            }
          }}
        >
          {loading ? "Syncing..." : "Refresh Feed"}
        </Button>
      </Stack>
    </Stack>
  );
};

export default OrderHeader;