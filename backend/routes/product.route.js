const express = require("express");
const router = express.Router();
const productController = require("../controller/product.controller.js");
const { checkPermission } = require("../middleware/permission.middleware.js");

router.post(
  "/",
  checkPermission("product:create"),
  productController.createProduct,
);
router.get("/", checkPermission("product:read"), productController.getProducts);
router.put(
  "/:id",
  checkPermission("product:update"),
  productController.updateProduct,
);
router.delete(
  "/:id",
  checkPermission("product:delete"),
  productController.deleteProduct,
);

module.exports = router;