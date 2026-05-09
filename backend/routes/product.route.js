const express = require("express");
const router = express.Router();
const productController = require("../controller/product.controller.js");
const { checkPermission } = require("../middleware/permission.middleware.js");
const { validateObjectId } = require("../middleware/validateId.middleware.js");
const { authenticate } = require("../middleware/auth.middleware.js");
const { withActivityLog } = require("../utils/withActivityLog.js");
const { validate } = require("../middleware/validation.middleware.js");
const { createProductSchema, getProductsSchema, deleteProductSchema, updateProductSchema } = require("../services/product.service.js");

// CREATE PRODUCT
router.post(
  "/",
  authenticate,
  checkPermission("product.create"),
  validate(createProductSchema),
  withActivityLog(productController.createProduct, (req, result, err) => ({
    action: "CREATE_PRODUCT",
    resource: "PRODUCT",
    resourceId: result?._id || null,
    description: err
      ? `Failed to create product: ${err.message}`
      : `Product created`,
    metadata: {
      body: req.body,
    },
  }))
);

// GET ALL PRODUCTS (no logging usually needed)
router.get(
  "/",
  authenticate,
  checkPermission("product.read"),
  validate(getProductsSchema),
  productController.getProducts
);

// UPDATE PRODUCT
router.put(
  "/:id",
  authenticate,
  checkPermission("product.update"),
  validate(updateProductSchema),
  withActivityLog(productController.updateProduct, (req, result, err) => ({
    action: "UPDATE_PRODUCT",
    resource: "PRODUCT",
    resourceId: req.params.id,
    description: err
      ? `Failed to update product: ${err.message}`
      : `Product updated`,
    metadata: {
      updatedFields: req.body,
    },
  }))
);

// DELETE PRODUCT
router.delete(
  "/:id",
  authenticate,
  checkPermission("product.delete"),
  validate(deleteProductSchema),
  withActivityLog(productController.deleteProduct, (req, result, err) => ({
    action: "DELETE_PRODUCT",
    resource: "PRODUCT",
    resourceId: req.params.id,
    description: err
      ? `Failed to delete product: ${err.message}`
      : `Product deleted`,
  }))
);

module.exports = router;