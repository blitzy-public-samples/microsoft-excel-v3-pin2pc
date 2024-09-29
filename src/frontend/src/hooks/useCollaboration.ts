import { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import { createWorkbook, getWorkbook, updateWorkbook, updateCell, createChart, updateChart } from '../services/api';
import { Workbook, Worksheet, Cell, Chart, User } from '../types/spreadsheet';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3000';

interface CollaborationState {
  workbook: Workbook | null;
  activeUsers: User[];
  pendingChanges: any[];
}

interface CollaborationActions {
  updateCell: (cellId: string, value: any) => void;
  createChart: (chartData: Partial<Chart>) => void;
  updateChart: (chartId: string, chartData: Partial<Chart>) => void;
}

const useCollaboration = (workbookId: string, user: User): CollaborationState & CollaborationActions => {
  const [state, setState] = useState<CollaborationState>({
    workbook: null,
    activeUsers: [],
    pendingChanges: [],
  });

  const socket = io(SOCKET_URL);

  useEffect(() => {
    const initializeWorkbook = async () => {
      try {
        const workbook = await getWorkbook(workbookId);
        setState((prevState) => ({ ...prevState, workbook }));
      } catch (error) {
        console.error('Error initializing workbook:', error);
      }
    };

    initializeWorkbook();

    socket.emit('join_workbook', { workbookId, user });

    socket.on('user_joined', (joinedUser: User) => {
      setState((prevState) => ({
        ...prevState,
        activeUsers: [...prevState.activeUsers, joinedUser],
      }));
    });

    socket.on('user_left', (leftUser: User) => {
      setState((prevState) => ({
        ...prevState,
        activeUsers: prevState.activeUsers.filter((u) => u.id !== leftUser.id),
      }));
    });

    socket.on('cell_updated', (updatedCell: Cell) => {
      setState((prevState) => ({
        ...prevState,
        workbook: prevState.workbook
          ? {
              ...prevState.workbook,
              worksheets: prevState.workbook.worksheets.map((ws) =>
                ws.id === updatedCell.worksheetId
                  ? { ...ws, cells: ws.cells.map((c) => (c.id === updatedCell.id ? updatedCell : c)) }
                  : ws
              ),
            }
          : null,
      }));
    });

    socket.on('chart_created', (newChart: Chart) => {
      setState((prevState) => ({
        ...prevState,
        workbook: prevState.workbook
          ? {
              ...prevState.workbook,
              charts: [...(prevState.workbook.charts || []), newChart],
            }
          : null,
      }));
    });

    socket.on('chart_updated', (updatedChart: Chart) => {
      setState((prevState) => ({
        ...prevState,
        workbook: prevState.workbook
          ? {
              ...prevState.workbook,
              charts: prevState.workbook.charts?.map((c) => (c.id === updatedChart.id ? updatedChart : c)),
            }
          : null,
      }));
    });

    return () => {
      socket.emit('leave_workbook', { workbookId, user });
      socket.disconnect();
    };
  }, [workbookId, user]);

  const updateCellAction = useCallback(
    async (cellId: string, value: any) => {
      try {
        const updatedCell = await updateCell(workbookId, cellId, value);
        socket.emit('update_cell', updatedCell);
      } catch (error) {
        console.error('Error updating cell:', error);
        // TODO: Implement robust error handling
      }
    },
    [workbookId, socket]
  );

  const createChartAction = useCallback(
    async (chartData: Partial<Chart>) => {
      try {
        const newChart = await createChart(workbookId, chartData);
        socket.emit('create_chart', newChart);
      } catch (error) {
        console.error('Error creating chart:', error);
        // TODO: Implement robust error handling
      }
    },
    [workbookId, socket]
  );

  const updateChartAction = useCallback(
    async (chartId: string, chartData: Partial<Chart>) => {
      try {
        const updatedChart = await updateChart(workbookId, chartId, chartData);
        socket.emit('update_chart', updatedChart);
      } catch (error) {
        console.error('Error updating chart:', error);
        // TODO: Implement robust error handling
      }
    },
    [workbookId, socket]
  );

  return {
    ...state,
    updateCell: updateCellAction,
    createChart: createChartAction,
    updateChart: updateChartAction,
  };
};

export default useCollaboration;

// TODO: Implement robust error handling for socket connection and real-time updates
// TODO: Add support for offline mode and synchronization when coming back online
// TODO: Implement end-to-end encryption for sensitive data
// TODO: Add comprehensive unit tests for the useCollaboration hook