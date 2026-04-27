import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

export const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
}));

export const HeaderContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(2),
}));

export const FiltersContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
  flexWrap: "wrap",
}));