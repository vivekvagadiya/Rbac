import { Table, TableHead, TableRow, TableCell, TableBody, Button } from "@mui/material";

const RoleTable = ({ roles, onEdit }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Role</TableCell>
          <TableCell>Permissions Count</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {roles.map((role) => (
          <TableRow key={role._id}>
            <TableCell sx={{textTransform:"capitalize"}}>{role.name}</TableCell>
            <TableCell>{role.permissions.length}</TableCell>
            <TableCell>
              <Button onClick={() => onEdit(role)}>Edit</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RoleTable;