import { 
  Stack, 
  TextField, 
  MenuItem, 
  InputAdornment, 
  Box, 
  styled, 
  alpha, 
  Button 
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";

// --- Styled Components ---

const FilterWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.grey[100], 0.5),
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  marginBottom: theme.spacing(2),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: theme.palette.background.paper,
    transition: "box-shadow 0.2s",
    "&:hover": {
      boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.05)}`,
    },
    "&.Mui-focused": {
      backgroundColor: theme.palette.background.paper,
    },
  },
}));

// --- Main Component ---

const ProductFilters = ({ filter, setFilter }) => {
  
  const handleUpdateFilter = (field) => (e) => {
    setFilter((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleReset = () => {
    setFilter({
      search: "",
      category: "all",
      status: "all",
    });
  };

  return (
    <FilterWrapper>
      <Stack 
        direction={{ xs: "column", sm: "row" }} 
        spacing={2} 
        sx={{alignItems:"center"}}
      >
        {/* 🔍 Search Products */}
        <StyledTextField
          placeholder="Search product name..."
          label="Search"
          size="small"
          fullWidth
          value={filter.search}
          onChange={handleUpdateFilter("search")}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon sx={{ color: "text.secondary", fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
        />

        {/* 🏷️ Category Filter */}
        <StyledTextField
          select
          label="Category"
          size="small"
          sx={{ minWidth: { xs: "100%", sm: 180 } }}
          value={filter.category}
          onChange={handleUpdateFilter("category")}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FilterListRoundedIcon sx={{ color: "text.disabled", fontSize: 18 }} />
              </InputAdornment>
            ),
          }}
        >
          <MenuItem value="all">All Categories</MenuItem>
          <MenuItem value="electronics">Electronics</MenuItem>
          <MenuItem value="clothing">Clothing</MenuItem>
          <MenuItem value="books">Books</MenuItem>
          <MenuItem value="food">Food</MenuItem>
          <MenuItem value="accessories">Accessories</MenuItem>
        </StyledTextField>

        {/* 🚦 Status Filter */}
        <StyledTextField
          select
          label="Status"
          size="small"
          sx={{ minWidth: { xs: "100%", sm: 160 } }}
          value={filter.status}
          onChange={handleUpdateFilter("status")}
        >
          <MenuItem value="all">All Status</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </StyledTextField>

        {/* 🔄 Reset Button */}
        <Button
          size="medium"
          variant="outlined"
          color="inherit"
          onClick={handleReset}
          startIcon={<RestartAltRoundedIcon />}
          sx={{ 
            borderRadius: "10px", 
            textTransform: "none", 
            fontWeight: 600,
            px: 3,
            borderColor: "divider",
            height: "40px" // Matching TextField height
          }}
        >
          Reset
        </Button>
      </Stack>
    </FilterWrapper>
  );
};

export default ProductFilters;