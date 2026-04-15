import mongoose from "mongoose";
import Product from "../models/product.model.js";

/**
 * GET PRODUCTS (Pagination)
 */
export const getProducts = async (query) => {
  const { page = 1, limit = 10 } = query;

  const parsedPage = parseInt(page);
  const parsedLimit = parseInt(limit);

  const skip = (parsedPage - 1) * parsedLimit;

  const filter = { isActive: true };

  const products = await Product.find(filter)
    .skip(skip)
    .limit(parsedLimit)
    .sort({ createdAt: -1 });

  const total = await Product.countDocuments(filter);

  return {
    products,
    total,
    page: parsedPage,
    limit: parsedLimit,
  };
};

/**
 * CREATE PRODUCT
 */
export const createProduct = async (data, userId) => {
  return await Product.create({
    ...data,
    createdBy: userId,
  });
};

/**
 * UPDATE PRODUCT
 */
export const updateProduct = async (id, data) => {
  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid product ID");
  }

  // Find existing product
  const product = await Product.findById(id);

  if (!product || !product.isActive) {
    throw new Error("Product not found");
  }

  // Update fields
  Object.assign(product, data);

  // Save updated product
  await product.save();

  return product;
};

/**
 * DELETE PRODUCT (Soft Delete)
 */
export const deleteProduct = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid product ID");
  }

  const product = await Product.findById(id);

  if (!product || !product.isActive) {
    throw new Error("Product not found");
  }

  product.isActive = false;
  await product.save();

  return { message: "Product deleted successfully" };
};
