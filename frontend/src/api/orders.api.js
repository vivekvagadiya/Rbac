import api from "./axios";
import { endpoints } from "./endpoints";

export const getOrders = async (params) => {
  try {
    const response = await api.get(endpoints.orders.getOrders, { params });
    return response?.data;
  } catch (error) {
    return error?.message;
  }
};
