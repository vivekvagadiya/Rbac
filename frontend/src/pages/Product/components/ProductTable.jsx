import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Chip,
  Paper,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const dummyData = [
  {
    _id: "1",
    name: "iPhone 15",
    category: "Electronics",
    price: 80000,
    stock: 10,
    isActive: true,
  },
];

const ProductTable = ({ onEdit }) => {
  return (
    <Paper sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Stock</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {dummyData.map((row) => (
            <TableRow key={row._id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.category}</TableCell>
              <TableCell>₹{row.price}</TableCell>
              <TableCell>{row.stock}</TableCell>

              <TableCell>
                <Chip
                  label={row.isActive ? "Active" : "Inactive"}
                  color={row.isActive ? "success" : "default"}
                />
              </TableCell>

              <TableCell align="right">
                <IconButton onClick={() => onEdit(row)}>
                  <EditIcon />
                </IconButton>

                <IconButton>
                  <DeleteIcon color="error" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default ProductTable;