import {
  Box,
  Button,
  MenuItem,
  TextField,
  InputAdornment,
  styled,
  alpha,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";

// --- Styled Components ---

const FilterContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  flexWrap: "wrap",
  alignItems: "center",
  padding: theme.spacing(2),
  backgroundColor: alpha(theme.palette.grey[100], 0.4),
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(3),
  border: `1px solid ${theme.palette.divider}`,
}));

const SearchField = styled(TextField)(({ theme }) => ({
  flexGrow: 1,
  minWidth: "250px",
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    backgroundColor: theme.palette.background.paper,
    transition: "box-shadow 0.2s",
    "&:hover": {
      boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.05)}`,
    },
    "&.Mui-focused": {
      backgroundColor: theme.palette.background.paper,
    },
  },
}));

const SelectField = styled(TextField)(({ theme }) => ({
  minWidth: "160px",
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    backgroundColor: theme.palette.background.paper,
  },
}));

const ResetButton = styled(Button)(({ theme }) => ({
  borderRadius: "12px",
  textTransform: "none",
  fontWeight: 600,
  padding: theme.spacing(0.8, 2),
  color: theme.palette.text.secondary,
  borderColor: theme.palette.divider,
  "&:hover": {
    backgroundColor: alpha(theme.palette.error.main, 0.05),
    color: theme.palette.error.main,
    borderColor: alpha(theme.palette.error.main, 0.2),
  },
}));

// --- Main Component ---

const UserFilter = ({ filters, setFilters, roles }) => {
  const getRoleOptions = roles?.map((item) => ({ label: item.name, value: item?._id })) || [];

  const handleFilterChange = (field) => (e) => {
    setFilters((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      role: "all",
      status: "all",
    });
  };

  return (
    <FilterContainer>
      {/* 🔍 Search Field */}
      <SearchField
        size="small"
        placeholder="Search by name, email..."
        value={filters.search}
        onChange={handleFilterChange("search")}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchRoundedIcon sx={{ color: "text.secondary", fontSize: 20 }} />
            </InputAdornment>
          ),
        }}
      />

      {/* 🎭 Role Filter */}
      <SelectField
        select
        size="small"
        label="Select Role"
        value={filters.role}
        onChange={handleFilterChange("role")}
      >
        <MenuItem value="all">All Roles</MenuItem>
        {getRoleOptions.map((option) => (
          <MenuItem key={option.value} value={option.label}>
            {option.label}
          </MenuItem>
        ))}
      </SelectField>

      {/* 📌 Status Filter */}
      <SelectField
        select
        size="small"
        label="Select Status"
        value={filters.status}
        onChange={handleFilterChange("status")}
      >
        <MenuItem value="all">Any Status</MenuItem>
        <MenuItem value="active">Active</MenuItem>
        <MenuItem value="blocked">Blocked</MenuItem>
        <MenuItem value="deleted">Deleted</MenuItem>
      </SelectField>

      {/* 🔄 Reset Button */}
      <ResetButton
        variant="outlined"
        startIcon={<RestartAltRoundedIcon size={18} />}
        onClick={resetFilters}
      >
        Reset
      </ResetButton>
    </FilterContainer>
  );
};

export default UserFilter;