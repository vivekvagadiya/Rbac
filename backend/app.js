const express = require("express");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error.middleware").default;

const app = express();
connectDB();

app.use(express.json());
app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/roles", require("./routes/role.route"));
app.use(errorHandler);

module.exports = app;
