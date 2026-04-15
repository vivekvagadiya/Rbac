import * as productService from "../services/product.service.js";

/**
 * GET PRODUCTS
 */
export const getProducts = async (req, res, next) => {
  try {
    const result = await productService.getProducts(req.query);

    res.status(200).json({
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
    const { name, description, price, category, stock } = req.body;

    // Basic validation
    if (!name || price == null || !category) {
      return res.status(400).json({
        success: false,
        message: "Name, price and category are required",
      });
    }

    const product = await productService.createProduct(
      {
        name,
        description,
        price,
        category,
        stock,
      },
      req.user._id
    );

    res.status(201).json({
      success: true,
      data: product,
    });
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

    const updatedProduct = await productService.updateProduct(id, req.body);

    res.status(200).json({
      success: true,
      data: updatedProduct,
    });
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

    const result = await productService.deleteProduct(id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};