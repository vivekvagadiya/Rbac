import api from "./axios";
import { endpoints } from "./endpoints";

export const getProducts = async (params) => {
  try {
    const response = await api.get(endpoints.product.getProduct, { params });
    return response?.data;
  } catch (error) {
    return error?.message;
  }
};
