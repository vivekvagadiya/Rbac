import { useState, useEffect, useContext } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  TextField,
  Grid,
  Chip,
  Divider,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Edit as EditIcon,
  PhotoCamera as PhotoCameraIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Shield as ShieldIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { updateUser, uploadPicture } from "../../api/user.api";

const Profile = () => {
  const { user,refetchUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  
  const [originalData, setOriginalData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
      });
      setOriginalData({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditToggle = () => {
    if (editMode) {
      // Reset to original data
      setFormData(originalData);
    }
    setEditMode(!editMode);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await updateUser(user._id,formData);
      
      if (response.success) {
        await refetchUser();
        setOriginalData(formData);
        setEditMode(false);
        showMessage("success", "Profile updated successfully!");
      }
    } catch (error) {
      showMessage("error", error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showMessage("error", "Only image files are allowed");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showMessage("error", "File size must be less than 5MB");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await uploadPicture(formData)

      if (response.success) {
        await refetchUser();
        showMessage("success", "Profile picture updated successfully!");
      }
    } catch (error) {
      showMessage("error", error?.message || "Failed to upload profile picture");
    } finally {
      setUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="600" color="text.primary">
          My Profile
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Manage your personal information and account settings
        </Typography>
      </Box>

      {/* Message Alert */}
      {message.text && (
        <Alert 
          severity={message.type} 
          sx={{ mb: 3 }}
          onClose={() => setMessage({ type: "", text: "" })}
        >
          {message.text}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Picture Section */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                  src={user.profilePicture}
                  alt={user.name}
                  sx={{
                    width: 120,
                    height: 120,
                    mx: 'auto',
                    mb: 2,
                    border: '3px solid',
                    borderColor: 'primary.main',
                  }}
                >
                  {user.name?.charAt(0)?.toUpperCase()}
                </Avatar>
                
                {/* Upload Button */}
                <input
                  accept="image/*"
                  id="profile-picture-upload"
                  type="file"
                  style={{ display: 'none' }}
                  onChange={handleProfilePictureUpload}
                  disabled={uploading}
                />
                <label htmlFor="profile-picture-upload">
                  <IconButton
                    component="span"
                    sx={{
                      position: 'absolute',
                      bottom: 10,
                      right: -10,
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': { bgcolor: 'primary.dark' },
                    }}
                    disabled={uploading}
                  >
                    {uploading ? <CircularProgress size={20} /> : <PhotoCameraIcon />}
                  </IconButton>
                </label>
              </Box>
              
              <Typography variant="h6" fontWeight="600" sx={{ mb: 1 }}>
                {user.name}
              </Typography>
              
              <Chip
                icon={<ShieldIcon />}
                label={user.role?.name || 'No Role'}
                color="primary"
                variant="outlined"
                sx={{ mb: 2 }}
              />
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                <Chip
                  icon={<ScheduleIcon />}
                  label={user.isBlocked ? 'Blocked' : 'Active'}
                  color={user.isBlocked ? 'error' : 'success'}
                  size="small"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* User Details Section */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="600">
                  Personal Information
                </Typography>
                <Button
                  variant={editMode ? "outlined" : "contained"}
                  startIcon={editMode ? <CancelIcon /> : <EditIcon />}
                  onClick={handleEditToggle}
                  disabled={loading}
                >
                  {editMode ? 'Cancel' : 'Edit Profile'}
                </Button>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!editMode || loading}
                    InputProps={{
                      startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!editMode || loading}
                    InputProps={{
                      startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Role"
                    value={user.role?.name || 'No Role'}
                    disabled
                    InputProps={{
                      startAdornment: <ShieldIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Account Status"
                    value={user.isBlocked ? 'Blocked' : 'Active'}
                    disabled
                    InputProps={{
                      startAdornment: <ScheduleIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Member Since"
                    value={new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                    disabled
                  />
                </Grid>
              </Grid>

              {/* Save Button */}
              {editMode && (
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={handleEditToggle}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                    onClick={handleSave}
                    disabled={loading || !hasChanges}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
