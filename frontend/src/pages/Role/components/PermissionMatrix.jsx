import { Box, Checkbox, FormControlLabel, Typography, Grid } from "@mui/material";

const PermissionMatrix = ({ groupedPermissions, selectedPermissions, onChange }) => {
  const handleToggle = (id) => {
    if (selectedPermissions.includes(id)) {
      onChange(selectedPermissions.filter((p) => p !== id));
    } else {
      onChange([...selectedPermissions, id]);
    }
  };

  return (
    <Box>
      {Object.entries(groupedPermissions).map(([module, actions]) => (
        <Box key={module} sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ textTransform: "capitalize" }}>
            {module}
          </Typography>

          <Grid container spacing={1}>
            {actions.map((perm) => (
              <Grid item xs={6} md={3} key={perm.id}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedPermissions.includes(perm.id)}
                      onChange={() => handleToggle(perm.id)}
                    />
                  }
                  label={perm.label}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Box>
  );
};

export default PermissionMatrix;