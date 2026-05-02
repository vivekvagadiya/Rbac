import mongoose from "mongoose";
import * as productService from "../services/product.service.js";

/**
 * GET PRODUCTS
 */
export const getProducts = async (req, res, next) => {
  try {
    const result = await productService.getProducts(req.query);

    return res.status(200).json({
      success: true,
      data: result.products,
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * CREATE PRODUCT
 */
export const createProduct = async (req, res, next) => {
  try {
    let { name, description, price, category, stock, isActive } = req.body;

    // Validation
    if (!name || !name.trim() || price == null || !category) {
      return res.status(400).json({
        success: false,
        message: "Name, price and category are required",
      });
    }

    if (price < 0) {
      return res.status(400).json({
        success: false,
        message: "Price cannot be negative",
      });
    }

    const product = await productService.createProduct(
      {
        name: name.trim(),
        description,
        price,
        category,
        stock: stock ?? 0,
        isActive: isActive ?? true,
      },
      req.user._id,
    );

    res.status(201).json({
      success: true,
      data: product,
      message: "Product created successfully",
    });
    return product;
  } catch (error) {
    next(error);
  }
};

/**
 * UPDATE PRODUCT
 */
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product id",
      });
    }

    const allowedFields = [
      "name",
      "description",
      "price",
      "category",
      "stock",
      "isActive",
    ];

    const updateData = {};

    for (let key of allowedFields) {
      if (req.body[key] !== undefined) {
        updateData[key] = req.body[key];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields to update",
      });
    }

    // Extra validation
    if (updateData.name !== undefined && !updateData.name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name cannot be empty",
      });
    }

    if (updateData.price !== undefined && updateData.price < 0) {
      return res.status(400).json({
        success: false,
        message: "Price cannot be negative",
      });
    }

    if (updateData.name) {
      updateData.name = updateData.name.trim();
    }

    const updatedProduct = await productService.updateProduct(
      id,
      updateData,
      req.user._id,
    );

    res.status(200).json({
      success: true,
      data: updatedProduct,
    });
    return updatedProduct;
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE PRODUCT (SOFT DELETE)
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product id",
      });
    }

    const result = await productService.deleteProduct(id, req.user._id);

    res.status(200).json({
      success: true,
      message: result.message, //  take from service
    });
  } catch (error) {
    next(error);
  }
};
