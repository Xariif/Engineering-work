import React from "react";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const MallStoreSelector = React.memo(({
  selectedMall,
  selectedStore,
  malls,
  stores,
  onMallChange,
  onStoreChange
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        mb: 3,
        flexDirection: { xs: "column", sm: "row" },
      }}
    >
      <FormControl fullWidth>
        <InputLabel>Mall</InputLabel>
        <Select
          value={selectedMall}
          onChange={onMallChange}
          label="Mall"
        >
          {malls.map((mall) => (
            <MenuItem key={mall.id} value={mall.name}>
              {mall.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Store</InputLabel>
        <Select
          value={selectedStore}
          onChange={onStoreChange}
          label="Store"
          disabled={!selectedMall}
        >
          {stores.map((store) => (
            <MenuItem key={store.id} value={store.id}>
              {store.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
});

export default MallStoreSelector; 