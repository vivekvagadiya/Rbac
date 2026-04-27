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
export const getOrderById = async (id) => {
  try {
    const response = await api.get(
      endpoints.orders.getOrderById.replace(":id", id),
    );
    return response?.data;
  } catch (error) {
    return error?.message;
  }
};
