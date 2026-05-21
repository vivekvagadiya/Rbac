import mongoose from "mongoose";
import * as productService from "../services/product.service.js";

/**
 * GET PRODUCTS
 */
export const getProducts = async (req, res, next) => {
  try {
    const result = await productService.getProducts(req.query,req.user);

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
    const { name, description, price, category, stock, isActive } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (category !== undefined) updateData.category = category;
    if (stock !== undefined) updateData.stock = stock;
    if (isActive !== undefined) updateData.isActive = isActive;

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

    const result = await productService.deleteProduct(id, req.user._id);

    res.status(200).json({
      success: true,
      message: result.message, //  take from service
    });
  } catch (error) {
    next(error);
  }
};
