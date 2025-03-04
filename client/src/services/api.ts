// src/services/api.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface User {
  id: string;
  name: string;
  email: string;
}

export const getUser = async (id: string): Promise<User> => {
  const response = await axios.get(`${API_URL}/users/${id}`);
  return response.data;
};