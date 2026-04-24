import { Box } from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { getAllUsers } from "../../api/user.api";

const UserPage = () => {
    const [users, setUsers] = useState([]);     // ✅ always array
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    /**
     * 🔹 Fetch Users (stable function)
     */
    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await getAllUsers();
            const userData = res;

            setUsers(userData?.users || userData || []);
        } catch (err) {
            console.error("Fetch users error:", err);

            const message =
                err?.response?.data?.message || err?.message || "Failed to fetch users";

            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * 🔹 Initial Load
     */
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return (
        <Box>
            {/* Debug for now */}
            <pre>{JSON.stringify({ users, loading, error }, null, 2)}</pre>
        </Box>
    );
};

export default UserPage;