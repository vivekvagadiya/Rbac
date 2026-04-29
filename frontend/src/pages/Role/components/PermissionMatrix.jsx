import {
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
  Grid,
  styled,
  alpha,
  Divider,
} from "@mui/material";

// --- Styled Components ---

const ModuleContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  overflow: "hidden",
  transition: "border-color 0.2s",
  "&:hover": {
    borderColor: theme.palette.primary.light,
  },
}));

const ModuleHeader = styled(Box)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.grey[100], 0.5),
  padding: theme.spacing(1.5, 2),
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const PermissionLabel = styled(FormControlLabel)(({ theme, checked }) => ({
  margin: 0,
  padding: theme.spacing(1),
  borderRadius: theme.spacing(1),
  width: "100%",
  transition: "background 0.2s",
  backgroundColor: checked ? alpha(theme.palette.primary.main, 0.04) : "transparent",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
  },
  "& .MuiTypography-root": {
    fontSize: "0.875rem",
    fontWeight: checked ? 600 : 400,
    color: checked ? theme.palette.primary.main : theme.palette.text.primary,
  },
}));

// --- Main Component ---

const PermissionMatrix = ({ groupedPermissions, selectedPermissions, onChange }) => {
  
  const handleToggle = (id) => {
    const nextValue = selectedPermissions.includes(id)
      ? selectedPermissions.filter((p) => p !== id)
      : [...selectedPermissions, id];
    onChange(nextValue);
  };

  const handleSelectAllModule = (moduleActions, isAllSelected) => {
    const actionIds = moduleActions.map((a) => a.id);
    if (isAllSelected) {
      // Remove all permissions belonging to this module
      onChange(selectedPermissions.filter((id) => !actionIds.includes(id)));
    } else {
      // Add all permissions belonging to this module (avoiding duplicates)
      const otherPermissions = selectedPermissions.filter((id) => !actionIds.includes(id));
      onChange([...otherPermissions, ...actionIds]);
    }
  };

  return (
    <Box>
      {Object.entries(groupedPermissions).map(([module, actions]) => {
        const moduleActionIds = actions.map((a) => a.id);
        const selectedInModule = moduleActionIds.filter((id) =>
          selectedPermissions.includes(id)
        );
        const isAllSelected = selectedInModule.length === moduleActionIds.length;
        const isIndeterminate =
          selectedInModule.length > 0 && selectedInModule.length < moduleActionIds.length;

        return (
          <ModuleContainer key={module}>
            <ModuleHeader>
              <Typography
                variant="subtitle2"
                sx={{ textTransform: "capitalize", fontWeight: 700, color: "text.secondary" }}
              >
                {module} Management
              </Typography>
              
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    indeterminate={isIndeterminate}
                    checked={isAllSelected}
                    onChange={() => handleSelectAllModule(actions, isAllSelected)}
                  />
                }
                label={
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    Select All
                  </Typography>
                }
              />
            </ModuleHeader>

            <Box sx={{ p: 2 }}>
              <Grid container spacing={1}>
                {actions.map((perm) => {
                  const isChecked = selectedPermissions.includes(perm.id);
                  return (
                    <Grid item xs={12} sm={6} md={3} key={perm.id}>
                      <PermissionLabel
                        checked={isChecked}
                        control={
                          <Checkbox
                            size="small"
                            checked={isChecked}
                            onChange={() => handleToggle(perm.id)}
                          />
                        }
                        label={perm.label}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          </ModuleContainer>
        );
      })}
    </Box>
  );
};

export default PermissionMatrix;