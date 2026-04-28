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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const RoleTable = ({ roles, onEdit, onDelete }) => {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Permissions</TableCell>
            <TableCell align="right" sx={{ fontWeight: 600 }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {roles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3}>
                <Typography align="center" sx={{ py: 3, color: "gray" }}>
                  No roles found
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            roles.map((role) => (
              <TableRow
                key={role._id}
                hover
                sx={{
                  "&:hover": { backgroundColor: "#fafafa" },
                }}
              >
                {/* Role Name */}
                <TableCell>
                  <Typography sx={{ textTransform: "capitalize", fontWeight: 500 }}>
                    {role.name}
                  </Typography>
                </TableCell>

                {/* Permissions Count */}
                <TableCell>
                  <Chip
                    label={`${role.permissions.length} permissions`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </TableCell>

                {/* Actions */}
                <TableCell align="right">
                  <Stack direction="row" spacing={1} sx={{justifyContent:"flex-end"}}>
                    
                    <Tooltip title="Edit Role">
                      <IconButton
                        color="primary"
                        onClick={() => onEdit(role)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete Role">
                      <IconButton
                        color="error"
                        onClick={() => onDelete(role)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>

                  </Stack>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RoleTable;