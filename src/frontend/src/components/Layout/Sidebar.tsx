import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight, InsertChart, Functions, PivotTable, DataObject } from '@mui/icons-material';
import { theme } from '../../styles/theme';
import { useSpreadsheetContext } from '../../contexts/SpreadsheetContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { toggleChartDialog, toggleFunctionDialog, togglePivotTableDialog, toggleDataAnalysisDialog } = useSpreadsheetContext();

  const handleChartClick = () => {
    toggleChartDialog();
    onClose();
  };

  const handleFunctionClick = () => {
    toggleFunctionDialog();
    onClose();
  };

  const handlePivotTableClick = () => {
    togglePivotTableDialog();
    onClose();
  };

  const handleDataAnalysisClick = () => {
    toggleDataAnalysisDialog();
    onClose();
  };

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={isOpen}
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: theme.palette.background.default,
        },
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: theme.spacing(0, 1) }}>
        <IconButton onClick={onClose}>
          {theme.direction === 'ltr' ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </div>
      <Divider />
      <List>
        <ListItem button onClick={handleChartClick}>
          <ListItemIcon>
            <InsertChart />
          </ListItemIcon>
          <ListItemText primary="Charts" />
        </ListItem>
        <ListItem button onClick={handleFunctionClick}>
          <ListItemIcon>
            <Functions />
          </ListItemIcon>
          <ListItemText primary="Functions" />
        </ListItem>
        <ListItem button onClick={handlePivotTableClick}>
          <ListItemIcon>
            <PivotTable />
          </ListItemIcon>
          <ListItemText primary="Pivot Tables" />
        </ListItem>
        <ListItem button onClick={handleDataAnalysisClick}>
          <ListItemIcon>
            <DataObject />
          </ListItemIcon>
          <ListItemText primary="Data Analysis" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;

// Human tasks:
// TODO: Implement handlers for each sidebar item to open respective dialogs or panels
// TODO: Add animations for smooth opening and closing of the sidebar
// TODO: Implement keyboard shortcuts to toggle the sidebar and navigate its items
// TODO: Add localization support for sidebar item text