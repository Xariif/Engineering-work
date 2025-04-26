import React from "react";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions, 
  Button, 
  TextField, 
  CircularProgress 
} from "@mui/material";
import { format } from "date-fns";

const TurnoverDialogs = ({ 
  editDialogOpen, 
  deleteDialogOpen, 
  selectedTurnover, 
  editTurnoverValue, 
  setEditTurnoverValue, 
  handleEditDialogClose, 
  handleDeleteDialogClose, 
  handleTurnoverUpdate, 
  handleTurnoverDelete, 
  isDeleting 
}) => {
  return (
    <>
      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
        <DialogTitle>Edit Turnover</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Edit turnover value for {selectedTurnover && format(new Date(selectedTurnover.date), "MMMM d, yyyy")}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Turnover Value"
            type="number"
            fullWidth
            variant="outlined"
            value={editTurnoverValue}
            onChange={(e) => setEditTurnoverValue(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancel</Button>
          <Button 
            onClick={handleTurnoverUpdate} 
            color="primary" 
            variant="contained"
            disabled={!editTurnoverValue}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>Delete Turnover</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the turnover record for {selectedTurnover && format(new Date(selectedTurnover.date), "MMMM d, yyyy")}?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} disabled={isDeleting}>Cancel</Button>
          <Button 
            onClick={handleTurnoverDelete} 
            color="error" 
            variant="contained"
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TurnoverDialogs; 