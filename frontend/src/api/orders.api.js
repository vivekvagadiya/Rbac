import api from "./axios";
import { endpoints } from "./endpoints";

export const getOrders = async (params) => {
  try {
    const response = await api.get(endpoints.orders.getOrders, { params });
    return response?.data;
  } catch (error) {
    console.log(error);

    throw error?.errors?.[0] || error;
  }
};
export const getOrderById = async (id) => {
  try {
    const response = await api.get(
      endpoints.orders.getOrderById.replace(":id", id),
    );
    return response?.data;
  } catch (error) {
    throw error?.errors?.[0] || error;
  }
};

export const updateOrderStatus = async (id, status) => {
  try {
    const response = await api.put(
      endpoints.orders.updateStatus.replace(":id", id),
      { status },
    );
    return response?.data;
  } catch (error) {
    throw error?.errors?.[0] || error;
  }
};
export const refundOrder = async (id) => {
  try {
    const response = await api.post(
      endpoints.orders.updateRefund.replace(":id", id),
    );
    return response?.data;
  } catch (error) {
    throw error?.errors?.[0] || error;
  }
};

export const getOrderStatusSummary = async () => {
  try {
    const response = await api.get(endpoints.orders.getStatusSummary);
    return response?.data;
  } catch (error) {
    throw error?.errors?.[0] || error;
  }
};
