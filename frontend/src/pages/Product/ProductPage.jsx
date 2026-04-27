import { Box, Typography, Button, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import ProductFilters from "./components/ProductFIlters";
import ProductTable from "./components/ProductTable";
import ProductFormModal from "./components/ProductFormModal";
import toast from "react-hot-toast";
import { getProducts } from "../../api/product.api";
import ProductDeleteModal from "./components/ProductDeleteModal";

const ProductPage = () => {
    const [products, setProducts] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [editData, setEditData] = useState(null);
    const [delOpen, setDelOpen] = useState(false)

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const [filter, setFilter] = useState({
        search: "",
        category: "all",
        status: "all",
    });

    const [debouncedSearch, setDebouncedSearch] = useState("");


    // 🔍 Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(filter.search);
        }, 500);

        return () => clearTimeout(timer);
    }, [filter.search]);

    // Reset page ONLY when filters change (not page itself)
    useEffect(() => {
        setPage(0);
    }, [debouncedSearch, filter.category, filter.status]);

    //  Build query (stable)
    const buildQuery = () => {
        const query = {
            page: page + 1,
            limit: rowsPerPage,
        };

        if (debouncedSearch?.trim()) {
            query.search = debouncedSearch.trim();
        }

        if (filter.category !== "all") {
            query.category = filter.category;
        }

        if (filter.status === "active") {
            query.isActive = true;
        } else if (filter.status === "inactive") {
            query.isActive = false;
        }

        return query;
    };

    //  Fetch products (race-safe)
    const fetchProducts = async () => {

        setLoading(true);
        try {

            const response = await getProducts(buildQuery());

            setProducts(response?.data || []);
            setTotal(response?.meta?.total || 0);
            setLoading(false)
        } catch (error) {
            toast.error(error?.message || "Failed to fetch products");
            setLoading(false)
        }
    };

    //  Fetch trigger
    useEffect(() => {
        fetchProducts();
    }, [page, rowsPerPage, debouncedSearch, filter.category, filter.status]);

    //  Pagination handlers
    const handleChangePage = (_, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };

    //  Add / Edit
    const handleAdd = () => {
        setEditData(null);
        setOpenModal(true);
    };

    const handleEdit = (row) => {
        setEditData(row);
        setOpenModal(true);
    };

    const handleDelete = (row) => {
        setEditData(row);
        setDelOpen(true)
    }

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Stack
                direction="row"
                sx={{ mb: 2, justifyContent: "space-between", alignItems: 'center' }}
            >
                <Typography variant="h5">Products</Typography>

                <Button variant="contained" onClick={handleAdd}>
                    Add Product
                </Button>
            </Stack>

            {/* Filters */}
            <ProductFilters filter={filter} setFilter={setFilter} />

            {/* Table */}
            <ProductTable
                products={products}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                page={page}
                rowsPerPage={rowsPerPage}
                total={total}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
            />

            {/* Modal */}
            <ProductFormModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onSuccess={() => fetchProducts()}
                editData={editData}
            />
            <ProductDeleteModal
                open={delOpen}
                onClose={() => setDelOpen(false)}
                product={editData}
                onSuccess={fetchProducts}
            />
        </Box>
    );
};

export default ProductPage;