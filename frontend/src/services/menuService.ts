import axios from 'axios';
import { MenuItem } from '../types/menu';

const API_URL = 'http://localhost:3002/api/menu';

export const menuService = {
  getAllMenuItems: async (): Promise<MenuItem[]> => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  getMenuItemById: async (id: string): Promise<MenuItem> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  createMenuItem: async (menuItem: Omit<MenuItem, 'id'>): Promise<MenuItem> => {
    const response = await axios.post(API_URL, menuItem);
    return response.data;
  },

  updateMenuItem: async (id: string, menuItem: Partial<MenuItem>): Promise<MenuItem> => {
    const response = await axios.put(`${API_URL}/${id}`, menuItem);
    return response.data;
  },

  deleteMenuItem: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  }
}; 