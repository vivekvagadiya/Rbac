const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const helmet = require("helmet");
// const { seedPermissions } = require("./seeds/permission.seed");
// const seedOrders = require("./seeds/order.seed");
const errorHandler = require("./middleware/error.middleware").default;
const { verifyEmailConnection } = require("./utils/email");

const app = express();
connectDB();

// Verify email connection on startup
verifyEmailConnection();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://rbac-frontend-flame.vercel.app",
      "https://rbac-frontend-git-main-vivek0093s-projects.vercel.app",
      "https://rbac-frontend-nzb7uojnp-vivek0093s-projects.vercel.app",
    ],
    credentials: true,
  }),
);

app.use(express.json());
app.use(helmet());
app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/roles", require("./routes/role.route"));
app.use("/api/products", require("./routes/product.route"));
app.use("/api/users", require("./routes/user.route"));
app.use("/api/orders", require("./routes/order.route"));
app.use("/api/payments", require("./routes/payment.route"));
app.use("/api/permissions", require("./routes/permission.route"));
app.use("/api/dashboard", require("./routes/dashboard.route"));
app.use("/api/activity", require("./routes/activity.route"));
// seedPermissions()
// seedOrders()
app.use(errorHandler);

module.exports = app;
