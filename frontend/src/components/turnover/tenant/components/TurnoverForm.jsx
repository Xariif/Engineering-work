import React from "react";
import { Box, Button, TextField, Divider } from "@mui/material";

const TurnoverForm = React.memo(({
  turnoverValue,
  onTurnoverValueChange,
  onSubmit,
  onDelete,
  disabled,
  isDateValid,
  selectedDate,
  selectedTurnoverId,
  exportComponent
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        flex: { xs: "1", md: "1" },
        width: "100%",
        mt: { xs: 2, md: 0 },
      }}
    >
      <TextField
        fullWidth
        label="Turnover Value"
        type="number"
        value={turnoverValue}
        onChange={(e) => onTurnoverValueChange(e.target.value)}
        disabled={disabled}
      />
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Button
          variant="outlined"
          onClick={onSubmit}
          disabled={disabled || !selectedDate || !turnoverValue ||
            !isDateValid(selectedDate)}
          fullWidth
          color={selectedTurnoverId ? "info" : "primary"}
        >
          {selectedTurnoverId ? "Update Turnover" : "Add Turnover"}
        </Button>
        {selectedTurnoverId && (
          <Button
            variant="outlined"
            color="error"
            onClick={onDelete}
            fullWidth
          >
            Delete Turnover
          </Button>
        )}
      </Box>
      
      {exportComponent && (
        <>
          <Divider sx={{ my: 1 }} />
          {exportComponent}
        </>
      )}
    </Box>
  );
});

export default TurnoverForm; 