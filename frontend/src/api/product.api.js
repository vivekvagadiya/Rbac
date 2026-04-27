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
export const createProduct = async (data) => {
  try {
    const response = await api.post(endpoints.product.updateProduct, data);
    return response?.data;
  } catch (error) {
    return error?.message;
  }
};
export const updateProduct = async (id,data) => {
  try {
    const response = await api.put(endpoints.product.updateProduct+`/${id}`, data);
    return response?.data;
  } catch (error) {
    return error?.message;
  }
};
