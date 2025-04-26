import React from "react";
import { Grid, Card, CardContent, Box, Typography, Avatar } from "@mui/material";

const UserAccessList = ({ accesses = [] }) => {
  return (
    <>
      {accesses && accesses.length > 0 ? (
        <Grid container spacing={2}>
          {accesses.map((access, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar sx={{ bgcolor: "secondary.main", mr: 2 }}>
                      {access.userName
                        ? access.userName
                            .split(" ")
                            .map((name) => name[0])
                            .join("")
                            .substring(0, 2)
                            .toUpperCase()
                        : "?"}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1">{access.userName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {access.userEmail}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography color="text.secondary">No users have access to this tenant</Typography>
      )}
    </>
  );
};

export default UserAccessList; 