import React from "react";
import { Box, Typography, Chip, Avatar } from "@mui/material";
import StoreIcon from "@mui/icons-material/Store";

const TenantHeader = ({ tenant }) => {
  if (!tenant) return null;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "center", sm: "flex-start" },
        height: "100%",
        padding: 3,
        borderRadius: 2,
        backgroundColor: "background.paper",
        boxShadow: 1,
        border: "1px solid",
        borderColor: "divider"
      }}
    >
      {tenant.imageUrl ? (
        <Box
          sx={{
            width: { xs: 120, sm: 150 },
            height: { xs: 120, sm: 150 },
            mr: { xs: 0, sm: 3 },
            mb: { xs: 2, sm: 0 },
            borderRadius: 1,
            boxShadow: 1,
            overflow: "hidden",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "background.paper"
          }}
        >
          <Box
            component="img"
            src={tenant.imageUrl}
            alt={tenant.name}
            sx={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain"
            }}
          />
        </Box>
      ) : (
        <Box
          sx={{
            width: { xs: 120, sm: 150 },
            height: { xs: 120, sm: 150 },
            mr: { xs: 0, sm: 3 },
            mb: { xs: 2, sm: 0 },
            bgcolor: "background.paper",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 1,
            boxShadow: 1,
            border: "1px solid",
            borderColor: "divider",
            flexShrink: 0
          }}
        >
          <StoreIcon sx={{ fontSize: { xs: 60, sm: 80 }, color: "primary.main" }} />
        </Box>
      )}

      <Box sx={{ width: "100%", textAlign: { xs: "center", sm: "left" } }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
          {tenant.name}
        </Typography>
        <Typography 
          variant="subtitle1" 
          color="text.secondary" 
          sx={{ 
            mt: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", sm: "flex-start" }
          }}
        >
          <StoreIcon sx={{ mr: 0.5, fontSize: "0.9rem" }} />
          {tenant.mall.name}
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", sm: "flex-start" }
          }}
        >
          {tenant.mall.address}
        </Typography>
        
        <Box 
          sx={{ 
            mt: 2, 
            pt: 2, 
            borderTop: "1px dashed", 
            borderColor: "divider",
            display: "flex",
            justifyContent: { xs: "center", sm: "flex-start" }
          }}
        >
          <Chip 
            label={`ID: ${tenant.id}`} 
            size="small" 
            color="primary" 
            variant="outlined" 
            sx={{ mr: 1 }}
          />
          <Chip 
            label={`${tenant.accesses ? tenant.accesses.length : 0} users`} 
            size="small" 
            color="secondary" 
            variant="outlined" 
          />
        </Box>
      </Box>
    </Box>
  );
};

export default TenantHeader; 