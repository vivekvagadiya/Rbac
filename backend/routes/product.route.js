const express = require("express");
const router = express.Router();
const productController = require("../controller/product.controller.js");
const { checkPermission } = require("../middleware/permission.middleware.js");
const { validateObjectId } = require("../middleware/validateId.middleware.js");
const { authenticate } = require("../middleware/auth.middleware.js");

router.post(
  "/",authenticate,
  checkPermission("product.create"),
  productController.createProduct,
);
router.get("/",authenticate, checkPermission("product.read"), productController.getProducts);
router.put(
  "/:id",
  validateObjectId,
  authenticate,
  checkPermission("product.update"),
  productController.updateProduct,
);
router.delete(
  "/:id",
  validateObjectId,
  authenticate,
  checkPermission("product.delete"),
  productController.deleteProduct,
);

module.exports = router;