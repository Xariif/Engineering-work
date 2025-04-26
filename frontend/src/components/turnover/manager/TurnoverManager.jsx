import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  CircularProgress,
  Avatar,
  Chip
} from "@mui/material";
import { useAuth } from "../../../context/AuthContext.jsx";
import { useToast } from "../../../context/ToastContext.jsx";
import accessService from "../../../services/accessService.js";
import StoreIcon from '@mui/icons-material/Store';
import { useNavigate } from "react-router-dom";

const TurnoverManager = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [malls, setMalls] = useState([]);
  const [selectedMall, setSelectedMall] = useState("");
  const [stores, setStores] = useState([]);

  // Get user role from localStorage
  const userDetails = JSON.parse(localStorage.getItem("userDetails") || "{}");
  const userRole = userDetails.role || "";

  useEffect(() => {
    if (userRole !== "Manager") {
      showToast("Access denied. Manager role required.", "error");
      navigate("/");
      return;
    }
    fetchAccessData();
  }, [userRole, navigate, showToast]);

  const fetchAccessData = async () => {
    try {
      setLoading(true);
      const response = await accessService.getAccessData();

      if (!response || !response.malls) {
        throw new Error("Invalid response format");
      }

      setMalls(response.malls);
      if (response.malls.length > 0) {
        setSelectedMall(response.malls[0].name);
        setStores(response.malls[0].stores);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching access data:", error);
      showToast("Failed to load mall and store data", "error");
      setLoading(false);
    }
  };

  const handleMallChange = (event) => {
    const mall = malls.find((m) => m.name === event.target.value);
    if (mall) {
      setSelectedMall(mall.name);
      setStores(mall.stores || []);
    }
  };

  const selectedMallData = useMemo(() => 
    malls.find(mall => mall.name === selectedMall),
    [malls, selectedMall]
  );

  const handleTenantClick = (tenantId) => {
    navigate(`/tenant/${tenantId}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          mb: 4,
          color: "primary.main",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
          fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
        }}
      >
        Mall Tenants Management
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Mall</InputLabel>
          <Select
            value={selectedMall}
            onChange={handleMallChange}
            label="Mall"
          >
            {malls.map((mall) => (
              <MenuItem key={mall.name} value={mall.name}>
                {mall.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedMallData && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {selectedMallData.name} - {selectedMallData.address}
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {stores.length} tenants available
            </Typography>
          </Box>
        )}
      </Paper>

      <Grid container spacing={3}>
        {stores.map((store) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={store.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': { transform: 'translateY(-4px)' }
              }}
            >
              <CardActionArea 
                onClick={() => handleTenantClick(store.id)}
                sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', height: '100%' }}
              >
                <CardContent sx={{ width: '100%', pt: 3, pb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {store.imageUrl ? (
                      <Avatar src={store.imageUrl} sx={{ width: 56, height: 56, mr: 2 }} />
                    ) : (
                      <Avatar sx={{ width: 56, height: 56, mr: 2, bgcolor: 'primary.main' }}>
                        <StoreIcon />
                      </Avatar>
                    )}
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                      {store.name}
                    </Typography>
                  </Box>
                  
                  {store.accesses && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Users with access:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {store.accesses.map((access, index) => (
                          <Chip 
                            key={index}
                            label={access.userName || access.userEmail} 
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                        {store.accesses.length === 0 && (
                          <Typography variant="body2" color="text.secondary">
                            No users assigned
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
        {stores.length === 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography>No tenants available for this mall</Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default TurnoverManager;
