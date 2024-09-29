import React, { useState, useContext } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ThemeContext } from '../../contexts/ThemeContext';
import { useSpreadsheet } from '../../hooks/useSpreadsheet';

// Define CellStyle interface (since we couldn't fetch it from spreadsheet.ts)
interface CellStyle {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  textDecoration?: 'none' | 'underline';
  textAlign?: 'left' | 'center' | 'right';
  verticalAlign?: 'top' | 'middle' | 'bottom';
  color?: string;
  backgroundColor?: string;
}

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

interface FormatDialogProps {
  open: boolean;
  onClose: () => void;
}

export const FormatDialog: React.FC<FormatDialogProps> = ({ open, onClose }) => {
  const classes = useStyles();
  const { theme } = useContext(ThemeContext);
  const { updateCellStyle } = useSpreadsheet();

  const [cellStyle, setCellStyle] = useState<CellStyle>({
    fontFamily: 'Arial',
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    textDecoration: 'none',
    textAlign: 'left',
    verticalAlign: 'middle',
    color: '#000000',
    backgroundColor: '#FFFFFF',
  });

  const handleChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const name = event.target.name as keyof CellStyle;
    setCellStyle({
      ...cellStyle,
      [name]: event.target.value,
    });
  };

  const handleApply = () => {
    updateCellStyle(cellStyle);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="format-dialog-title">
      <DialogTitle id="format-dialog-title">Format Cell</DialogTitle>
      <DialogContent>
        <FormControl className={classes.formControl}>
          <InputLabel id="font-family-label">Font Family</InputLabel>
          <Select
            labelId="font-family-label"
            id="font-family"
            name="fontFamily"
            value={cellStyle.fontFamily}
            onChange={handleChange}
          >
            <MenuItem value="Arial">Arial</MenuItem>
            <MenuItem value="Helvetica">Helvetica</MenuItem>
            <MenuItem value="Times New Roman">Times New Roman</MenuItem>
          </Select>
        </FormControl>
        <TextField
          id="font-size"
          name="fontSize"
          label="Font Size"
          type="number"
          value={cellStyle.fontSize}
          onChange={handleChange}
          className={classes.formControl}
        />
        <FormControl className={classes.formControl}>
          <InputLabel id="font-weight-label">Font Weight</InputLabel>
          <Select
            labelId="font-weight-label"
            id="font-weight"
            name="fontWeight"
            value={cellStyle.fontWeight}
            onChange={handleChange}
          >
            <MenuItem value="normal">Normal</MenuItem>
            <MenuItem value="bold">Bold</MenuItem>
          </Select>
        </FormControl>
        {/* Add more style options here */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleApply} color="primary">
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Human tasks (commented)
/*
TODO: Implement color picker for font and background color selection
TODO: Add preview functionality to show real-time changes before applying
TODO: Implement undo/redo functionality for format changes
*/