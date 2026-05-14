const { test } = require('node:test');
const assert = require('node:assert');
const http = require('http');

// Test if server can start and respond
test('Backend startup test', async () => {
  const PORT = process.env.PORT || 5001; // Use different port for testing
  
  // Import and start server
  process.env.PORT = PORT;
  const app = require('../app');
  
  const server = app.listen(PORT);
  
  // Test if server responds
  await new Promise((resolve, reject) => {
    const req = http.get(`http://localhost:${PORT}/`, (res) => {
      assert(res.statusCode === 404 || res.statusCode === 200); // Should respond (even with 404)
      resolve();
    });
    
    req.on('error', reject);
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
  
  // Clean up
  server.close();
});

test('MongoDB connection test', async () => {
  const connectDB = require('../config/db');
  
  try {
    await connectDB();
    assert.ok(true, 'MongoDB connected successfully');
  } catch (error) {
    assert.fail(`MongoDB connection failed: ${error.message}`);
  }
});
