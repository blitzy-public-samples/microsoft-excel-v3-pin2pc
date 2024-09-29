import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText
} from '@material-ui/core';
import { Workbook } from '../../types/spreadsheet';
import useSpreadsheet from '../../hooks/useSpreadsheet';
import api from '../../services/api';

interface FileDialogProps {
  open: boolean;
  onClose: () => void;
  operation: 'open' | 'save' | 'new';
}

const FileDialog: React.FC<FileDialogProps> = ({ open, onClose, operation }) => {
  const { workbook, setWorkbook } = useSpreadsheet();
  const [fileName, setFileName] = useState('');
  const [fileList, setFileList] = useState<Workbook[]>([]);

  useEffect(() => {
    if (open) {
      fetchFileList();
    }
  }, [open]);

  const fetchFileList = async () => {
    try {
      const workbooks = await api.getWorkbooks();
      setFileList(workbooks);
    } catch (error) {
      console.error('Error fetching workbooks:', error);
      // TODO: Implement error handling
    }
  };

  const handleFileNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(event.target.value);
  };

  const handleFileOperation = async () => {
    try {
      let updatedWorkbook: Workbook | null = null;

      switch (operation) {
        case 'open':
          updatedWorkbook = await api.openWorkbook(fileName);
          break;
        case 'save':
          if (workbook) {
            updatedWorkbook = await api.saveWorkbook(workbook, fileName);
          }
          break;
        case 'new':
          updatedWorkbook = await api.createWorkbook(fileName);
          break;
      }

      if (updatedWorkbook) {
        setWorkbook(updatedWorkbook);
      }

      onClose();
    } catch (error) {
      console.error('Error performing file operation:', error);
      // TODO: Implement error handling
    }
  };

  const handleFileSelect = (selectedWorkbook: Workbook) => {
    setFileName(selectedWorkbook.name);
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="file-dialog-title">
      <DialogTitle id="file-dialog-title">
        {operation === 'open' ? 'Open Workbook' : operation === 'save' ? 'Save Workbook' : 'New Workbook'}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="fileName"
          label="File Name"
          type="text"
          fullWidth
          value={fileName}
          onChange={handleFileNameChange}
        />
        {operation === 'open' && (
          <List>
            {fileList.map((file) => (
              <ListItem button key={file.id} onClick={() => handleFileSelect(file)}>
                <ListItemText primary={file.name} />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleFileOperation} color="primary">
          {operation === 'open' ? 'Open' : operation === 'save' ? 'Save' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FileDialog;

// TODO: Implement error handling for API calls in the FileDialog component
// TODO: Add loading indicators for asynchronous operations
// TODO: Implement file format validation when saving or opening files
// TODO: Add confirmation dialogs for overwriting existing files when saving
// TODO: Implement drag and drop functionality for file uploads