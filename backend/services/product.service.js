import Product from "../models/product.model.js";
import ApiError from "../utils/ApiError.js";

/**
 * GET PRODUCTS (Pagination)
 */

export const getProducts = async (query) => {
  let { page = 1, limit = 10, search, isActive, category } = query;

  page = Math.max(1, parseInt(page) || 1);
  limit = Math.min(50, Math.max(1, parseInt(limit) || 10));

  const skip = (page - 1) * limit;

  const filter = {};

  // 🔍 Search
  if (search?.trim()) {
    const regex = new RegExp(search.trim(), "i");
    filter.$or = [
      { name: regex },
      { description: regex },
    ];
  }

  // 📦 Category
  if (category) {
    filter.category = category;
  }

  // 🔄 Status (BOOLEAN ONLY)
 if(isActive ){
  filter.isActive=isActive
 }

  const [products, total] = await Promise.all([
    Product.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean(),

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
      createdBy: userId,
      updatedBy: userId,
    });
  } catch (err) {
    throw new ApiError(400, err.message);
  }
};

/**
 * UPDATE PRODUCT
 */
export const updateProduct = async (id, data, userId) => {
  if (!data || Object.keys(data).length === 0) {
    throw new ApiError(400, "No data provided for update");
  }

  const updatedProduct = await Product.findOneAndUpdate(
    { _id: id, isActive: true },
    {
      $set: {
        ...data,
        updatedBy: userId,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  ).lean();

  if (!updatedProduct) {
    throw new ApiError(404, "Product not found");
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
    throw new ApiError(404, "Product not found");
  }

  return { message: "Product deleted successfully" };
};
