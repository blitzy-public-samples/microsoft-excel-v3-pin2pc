import axios from 'axios';
import { Workbook, Worksheet, Cell, Chart } from '../types/spreadsheet';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createWorkbook = async (name: string): Promise<Workbook> => {
  try {
    const response = await api.post<Workbook>('/workbooks', { name });
    return response.data;
  } catch (error) {
    console.error('Error creating workbook:', error);
    throw error;
  }
};

export const getWorkbook = async (id: string): Promise<Workbook> => {
  try {
    const response = await api.get<Workbook>(`/workbooks/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error retrieving workbook:', error);
    throw error;
  }
};

export const updateWorkbook = async (id: string, workbook: Partial<Workbook>): Promise<Workbook> => {
  try {
    const response = await api.patch<Workbook>(`/workbooks/${id}`, workbook);
    return response.data;
  } catch (error) {
    console.error('Error updating workbook:', error);
    throw error;
  }
};

export const deleteWorkbook = async (id: string): Promise<void> => {
  try {
    await api.delete(`/workbooks/${id}`);
  } catch (error) {
    console.error('Error deleting workbook:', error);
    throw error;
  }
};

export const createWorksheet = async (workbookId: string, name: string): Promise<Worksheet> => {
  try {
    const response = await api.post<Worksheet>(`/workbooks/${workbookId}/worksheets`, { name });
    return response.data;
  } catch (error) {
    console.error('Error creating worksheet:', error);
    throw error;
  }
};

export const updateCell = async (
  workbookId: string,
  worksheetId: string,
  cellId: string,
  cellData: Partial<Cell>
): Promise<Cell> => {
  try {
    const response = await api.patch<Cell>(
      `/workbooks/${workbookId}/worksheets/${worksheetId}/cells/${cellId}`,
      cellData
    );
    return response.data;
  } catch (error) {
    console.error('Error updating cell:', error);
    throw error;
  }
};

export const createChart = async (
  workbookId: string,
  worksheetId: string,
  chartData: Omit<Chart, 'id'>
): Promise<Chart> => {
  try {
    const response = await api.post<Chart>(
      `/workbooks/${workbookId}/worksheets/${worksheetId}/charts`,
      chartData
    );
    return response.data;
  } catch (error) {
    console.error('Error creating chart:', error);
    throw error;
  }
};

export const updateChart = async (
  workbookId: string,
  worksheetId: string,
  chartId: string,
  chartData: Partial<Chart>
): Promise<Chart> => {
  try {
    const response = await api.patch<Chart>(
      `/workbooks/${workbookId}/worksheets/${worksheetId}/charts/${chartId}`,
      chartData
    );
    return response.data;
  } catch (error) {
    console.error('Error updating chart:', error);
    throw error;
  }
};

// TODO: Implement error handling and retries for API requests
// TODO: Add authentication token handling for secure API requests
// TODO: Implement request cancellation for long-running operations
// TODO: Add comprehensive JSDoc comments for better code documentation

export default api;