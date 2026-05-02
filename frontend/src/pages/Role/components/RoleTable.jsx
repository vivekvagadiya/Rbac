import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Paper,
  TableContainer,
  Typography,
  Stack,
  Chip,
  Tooltip,
  styled,
  alpha,
  CircularProgress,
} from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";

// --- Styled Components ---

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.03)",
  background: theme.palette.background.paper,
}));

const HeaderRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.grey[100], 0.8),
  "& th": {
    color: theme.palette.text.secondary,
    fontWeight: 700,
    fontSize: "0.75rem",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    padding: theme.spacing(2),
  },
}));

const ActionButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== "variant",
})(({ theme, variant }) => ({
  backgroundColor: variant === "error"
    ? alpha(theme.palette.error.main, 0.08)
    : alpha(theme.palette.primary.main, 0.08),
  color: variant === "error" ? theme.palette.error.main : theme.palette.primary.main,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1),
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: variant === "error" ? theme.palette.error.main : theme.palette.primary.main,
    color: "#fff",
    transform: "translateY(-2px)",
  },
}));

const RoleName = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: "0.9rem",
  color: theme.palette.text.primary,
}));

// --- Main Component ---

const RoleTable = ({ roles = [], onEdit, onDelete, loading }) => {
  return (
    <StyledTableContainer component={Paper} elevation={0}>
      <Table>
        <TableHead>
          <HeaderRow>
            <TableCell>Role Detail</TableCell>
            <TableCell>Access Level</TableCell>
            <TableCell align="right">Manage</TableCell>
          </HeaderRow>
        </TableHead>

        <TableBody>
          {loading ?
            (<TableRow>
              <TableCell colSpan={3} align="center" sx={{ py: 8 }}>
                <CircularProgress size={32} thickness={5} />
              </TableCell>

            </TableRow>) :
            roles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3}>
                  <Stack alignItems="center" sx={{ py: 6 }}>
                    <ShieldRoundedIcon sx={{ fontSize: 40, color: "grey.300", mb: 1 }} />
                    <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500 }}>
                      No administrative roles found
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            ) : (
              roles.map((role) => (
                <TableRow
                  key={role._id}
                  hover
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {/* Role Name */}
                  <TableCell>
                    <RoleName sx={{ textTransform: "capitalize" }}>
                      {role.name}
                    </RoleName>
                  </TableCell>

                  {/* Permissions Count */}
                  <TableCell>
                    <Chip
                      label={`${role.permissions?.length || 0} Permissions`}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        fontSize: "0.65rem",
                        textTransform: "uppercase",
                        bgcolor: alpha("#2e7d32", 0.1), // success green soft bg
                        color: "#1b5e20",
                        border: "1px solid",
                        borderColor: alpha("#2e7d32", 0.2),
                        borderRadius: 1.5,
                      }}
                    />
                  </TableCell>

                  {/* Actions */}
                  <TableCell align="right">
                    <Stack direction="row" spacing={2} sx={{ justifyContent: "flex-end" }}>
                      <Tooltip title="Edit Role" arrow>
                        <ActionButton onClick={() => onEdit(role)}>
                          <EditRoundedIcon fontSize="small" />
                        </ActionButton>
                      </Tooltip>

                      <Tooltip title="Delete Role" arrow>
                        <ActionButton variant="error" onClick={() => onDelete(role)}>
                          <DeleteOutlineRoundedIcon fontSize="small" />
                        </ActionButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
};

export default RoleTable;