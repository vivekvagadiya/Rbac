import mongoose from "mongoose";
import Product from "../models/product.model.js";
import ApiError, { NotFoundError, ValidationError } from "../utils/ApiError.js";

/**
 * GET PRODUCTS (Pagination)
 */

export const getProducts = async (query, user) => {
  let { page = 1, limit = 10, search, isActive, category } = query;
  console.log("user", user);

  page = Math.max(1, parseInt(page) || 1);
  limit = Math.min(50, Math.max(1, parseInt(limit) || 10));

  const skip = (page - 1) * limit;

  const filter = {};

  //  Search
  if (search?.trim()) {
    const regex = new RegExp(search.trim(), "i");
    filter.$or = [{ name: regex }, { description: regex }];

    if (mongoose.Types.ObjectId.isValid(search.trim())) {
      filter.$or.push({
        _id: new mongoose.Types.ObjectId(search.trim()),
      });
    }
  }

  //  Category
  if (category) {
    filter.category = category;
  }

  if (user.role.name === "user") {
    filter.createdBy = user._id;
  }

  //  Status (BOOLEAN ONLY)
  if (isActive) {
    filter.isActive = isActive;
  }

  const [products, total] = await Promise.all([
    Product.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),

    Product.countDocuments(filter),
  ]);

  return {
    products,
    total,
    page,
    limit,
  };
};

/**
 * CREATE PRODUCT
 */
export const createProduct = async (data, userId) => {
  try {
    return await Product.create({
      ...data,
      name: data.name.trim(),
      stock: data.stock ?? 0,
      isActive: data.isActive ?? true,
      createdBy: userId,
      updatedBy: userId,
    });
  } catch (err) {
    throw new ValidationError(err.message);
  }
};

/**
 * UPDATE PRODUCT
 */
export const updateProduct = async (id, data, userId) => {
  if (!data || Object.keys(data).length === 0) {
    throw new ValidationError("No data provided for update");
  }

  // Ensure userId is a valid ObjectId
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new ValidationError("Invalid user ID");
  }

  // Remove any updatedBy from data to prevent conflicts
  const { updatedBy, ...cleanData } = data;

  const updatedProduct = await Product.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        ...cleanData,
        updatedBy: userId,
      },
    },
    {
      returnDocument: "after",
      runValidators: true,
    },
  ).lean();

  if (!updatedProduct) {
    throw new NotFoundError("Product not found");
  }

  return updatedProduct;
};

/**
 * DELETE PRODUCT (Soft Delete)
 */
export const deleteProduct = async (id, userId) => {
  const deleted = await Product.findOneAndUpdate(
    { _id: id, isActive: true },
    {
      $set: {
        isActive: false,
        updatedBy: userId,
      },
    },
    { new: true },
  ).lean();

  if (!deleted) {
    throw new NotFoundError("Product not found");
  }

  return { message: "Product deleted successfully" };
};
