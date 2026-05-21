require("dotenv").config();

const { test, after } = require("node:test");
const assert = require("node:assert");
const http = require("http");
const mongoose = require("mongoose");

test("Backend startup test", async () => {
  const PORT = process.env.PORT;

  const app = require("../app");

  const server = app.listen(PORT);

  await new Promise((resolve, reject) => {
    const req = http.get(`http://localhost:${PORT}/`, (res) => {
      assert.ok(res.statusCode === 404 || res.statusCode === 200);
      resolve();
    });

    req.on("error", reject);

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error("Request timeout"));
    });
  });

  server.close();
});

test("MongoDB connection test", async () => {
  const connectDB = require("../config/db");

  await connectDB();

  assert.equal(mongoose.connection.readyState, 1);
});

after(async () => {
  await mongoose.connection.close();
});