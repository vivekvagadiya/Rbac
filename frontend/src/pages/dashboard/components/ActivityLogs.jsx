import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  Chip,
  Avatar,
  Divider,
  Stack,
} from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  timelineItemClasses,
} from "@mui/lab"; // You may need to install @mui/lab
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getActivityLog } from "../../../api/dashboard.api";
import dayjs from "dayjs";
import HistoryIcon from "@mui/icons-material/History";
import PersonIcon from "@mui/icons-material/Person";

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await getActivityLog({page:1,limit:10});
      setLogs(res?.data || []);
    } catch (error) {
      toast.error(error?.message || "Failed to fetch logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: "100%",
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Stack direction="row" sx={{alignItems:'center',mb:3}} spacing={1}>
        <HistoryIcon color="primary" />
        <Typography variant="h6" sx={{fontWeight:800}}>
          Recent Activity
        </Typography>
      </Stack>

      <Box sx={{ flexGrow: 1, overflowY: "auto", pr: 1 }}>
        {/* 🔄 Loader */}
        {loading && (
          <Box display="flex" justifyContent="center" alignItems="center" height="200px">
            <CircularProgress size={30} thickness={4} />
          </Box>
        )}

        {/* ❌ Empty State */}
        {!loading && logs.length === 0 && (
          <Box textAlign="center" py={5}>
            <Typography variant="body2" color="text.secondary">
              No recent activity found.
            </Typography>
          </Box>
        )}

        {/* ✅ Logs List with Timeline */}
        {!loading && (
          <Timeline
            sx={{
              [`& .${timelineItemClasses.root}:before`]: {
                flex: 0,
                padding: 0,
              },
              p: 0,
              m: 0,
            }}
          >
            {logs.map((log, index) => (
              <TimelineItem key={log._id}>
                <TimelineSeparator>
                  <TimelineDot
                    variant="outlined"
                    color={log.status === "SUCCESS" ? "success" : "error"}
                    sx={{ p: 0.5 }}
                  />
                  {index !== logs.length - 1 && <TimelineConnector sx={{ bgcolor: "divider" }} />}
                </TimelineSeparator>

                <TimelineContent sx={{ pb: 3, pr: 0 }}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: "grey.50",
                      transition: "0.2s",
                      "&:hover": { bgcolor: "grey.100" },
                      border: "1px solid",
                      borderColor: "transparent",
                      "&:hover": { borderColor: "divider" },
                    }}
                  >
                    <Stack direction="row" sx={{justifyContent:"space-between",alignItems:"flex-start",mb:1}}>
                      <Typography variant="subtitle2" fontWeight={600} sx={{ color: "text.primary" }}>
                        {log.description}
                      </Typography>
                      <Chip
                        size="small"
                        label={log.status}
                        variant="outlined"
                        color={log.status === "SUCCESS" ? "success" : "error"}
                        sx={{ fontSize: "10px", height: "20px", fontWeight: 700 }}
                      />
                    </Stack>

                    <Stack direction="row" sx={{alignItems:"center",mb:1}} spacing={1}>
                      <Avatar sx={{ width: 18, height: 18, fontSize: 10, bgcolor: "primary.light" }}>
                        {log.userId?.name?.charAt(0) || "U"}
                      </Avatar>
                      <Typography variant="caption" color="text.secondary">
                        <Box component="span" fontWeight={600} color="text.primary">
                          {log.userId?.name || "System"}
                        </Box>{" "}
                        performed <Box component="span" sx={{ textTransform: "lowercase", fontStyle: "italic" }}>{log.action}</Box>
                      </Typography>
                    </Stack>

                    <Typography variant="caption" display="block" color="text.disabled">
                      {dayjs(log.createdAt).format("MMM DD, YYYY • hh:mm A")}
                    </Typography>
                  </Box>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        )}
      </Box>
    </Paper>
  );
};

export default ActivityLogs;