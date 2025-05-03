import axios from 'axios';
import { Order } from '../types/order';

const API_URL = 'http://localhost:3002/api/orders';

export const orderService = {
  getAllOrders: async (): Promise<Order[]> => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  getOrderById: async (id: string): Promise<Order> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  createOrder: async (order: Partial<Order>): Promise<Order> => {
    const response = await axios.post(API_URL, order);
    return response.data;
  },

  updateOrder: async (id: string, order: Partial<Order>): Promise<Order> => {
    const response = await axios.put(`${API_URL}/${id}`, order);
    return response.data;
  },

  updateOrderStatus: async (id: string, status: Order['status']): Promise<Order> => {
    const response = await axios.put(`${API_URL}/${id}/status`, { status });
    return response.data;
  },

  addItemToOrder: async (orderId: string, item: Partial<Order['items'][0]>): Promise<Order> => {
    const response = await axios.post(`${API_URL}/${orderId}/items`, item);
    return response.data;
  },

  updateOrderItem: async (orderId: string, itemId: string, item: Partial<Order['items'][0]>): Promise<Order> => {
    const response = await axios.put(`${API_URL}/${orderId}/items/${itemId}`, item);
    return response.data;
  },

  deleteOrderItem: async (orderId: string, itemId: string): Promise<Order> => {
    const response = await axios.delete(`${API_URL}/${orderId}/items/${itemId}`);
    return response.data;
  },

  deleteOrder: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  }
}; 