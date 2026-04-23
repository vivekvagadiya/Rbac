const express = require("express");
const connectDB = require("./config/db");
const { seedPermissions } = require("./seeds/permission.seed");
const errorHandler = require("./middleware/error.middleware").default;

const app = express();
connectDB();

app.use(express.json());
app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/roles", require("./routes/role.route"));
app.use("/api/products",require("./routes/product.route"));
app.use("/api/users",require("./routes/user.route"))
app.use("/api/orders",require("./routes/order.route"))
// seedPermissions()
app.use(errorHandler);

module.exports = app;
