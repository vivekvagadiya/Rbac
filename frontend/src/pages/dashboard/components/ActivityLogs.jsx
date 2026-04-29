import { Paper, Typography, Box } from "@mui/material";

const logs = [
  "Order marked as shipped",
  "User created",
  "Role updated",
  "Product added",
];

const ActivityLogs = () => {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography fontWeight={600} mb={1}>
        Activity
      </Typography>

      {logs.map((log, i) => (
        <Box key={i} sx={{ mb: 1, fontSize: 14 }}>
          • {log}
        </Box>
      ))}
    </Paper>
  );
};

export default ActivityLogs;