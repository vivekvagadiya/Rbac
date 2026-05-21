import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { products } from "../../../data.js";
import { paymentAPI } from "../../api/payment.api.js";
import "./PaymentPage.css";
import { useEffect } from "react";
import { getProducts } from "../../api/product.api.js";
import toast from "react-hot-toast";
import ProductFilters from "../Product/components/ProductFIlters.jsx";
import { TablePagination } from "@mui/material";

const PaymentPage = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState({
    search: "",
    category: "all",
    status: "all",
  });

  const navigate = useNavigate();
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filter.search);
    }, 500);

    return () => clearTimeout(timer);
  }, [filter.search]);

  useEffect(() => {
    setPage(0);
  }, [debouncedSearch,filter.category, filter.status]);

  //  Build query (stable)
  const buildQuery = () => {
    const query = {
      page: page + 1,
      limit: rowsPerPage,
    };

    if (debouncedSearch?.trim()) {
      query.search = debouncedSearch.trim();
    }

    if (filter.category !== "all") {
      query.category = filter.category;
    }

    if (filter.status === "active") {
      query.isActive = true;
    } else if (filter.status === "inactive") {
      query.isActive = false;
    }

    return query;
  };

  //  Fetch products (race-safe)
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await getProducts(buildQuery());

      setProducts(response?.data || []);
      setTotal(response?.meta?.total || 0);
      setLoading(false);
    } catch (error) {
      toast.error(error?.message || "Failed to fetch products");
      setLoading(false);
    }
  };

  //  Fetch trigger
  useEffect(() => {
    fetchProducts();
  }, [page, rowsPerPage, debouncedSearch, filter.category, filter.status]);

  //  Pagination handlers
  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleProductSelect = (product) => {
    // Check if product is already in cart and validate stock
    const existing = selectedProducts.find((p) => p._id === product._id);
    const currentQuantity = existing ? existing.quantity : 0;
    
    if (currentQuantity >= product.stock) {
      toast.error(`Cannot add more ${product.name}. Only ${product.stock} in stock.`);
      return;
    }

    setSelectedProducts((prev) => {
      if (existing) {
        return prev.map((p) =>
          p._id === product._id ? { ...p, quantity: p.quantity + 1 } : p,
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
    toast.success(`${product.name} added to cart`);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    const product = selectedProducts.find((p) => p._id === productId);
    if (!product) return;

    // Validate against stock
    if (newQuantity > product.stock) {
      toast.error(`Only ${product.stock} ${product.name} available in stock`);
      return;
    }

    if (newQuantity <= 0) {
      setSelectedProducts((prev) => prev.filter((p) => p._id !== productId));
      toast.success(`${product.name} removed from cart`);
    } else {
      setSelectedProducts((prev) =>
        prev.map((p) =>
          p._id === productId ? { ...p, quantity: newQuantity } : p,
        ),
      );
    }
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts((prev) => prev.filter((p) => p._id !== productId));
  };

  const calculateTotal = () => {
    return selectedProducts.reduce(
      (total, product) => total + product.price * product.quantity,
      0,
    );
  };

  const handleStripePayment = async () => {
    if (selectedProducts.length === 0) {
      setError("Please select at least one product");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const items = selectedProducts.map((product) => ({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        description: product.description,
        category: product.category,
      }));

      const response = await paymentAPI.createCheckoutSession(items);
      console.log('response',response);
      

      if (response.success && response?.data.url) {
        window.location.href = response?.data.url;
      } else {
        setError("Failed to create payment session");
      }
    } catch (error) {
      setError(error.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-container">
        <h1>Complete Your Purchase</h1>
        <ProductFilters filter={filter} setFilter={setFilter} />

        <div className="payment-content">
          {/* Product Selection */}
          <div className="products-section">
            <h2>Available Products</h2>
            {loading ? (
              <div className="products-loading">
                {[...Array(rowsPerPage)].map((_, index) => (
                  <div key={index} className="product-skeleton">
                    <div className="skeleton-header"></div>
                    <div className="skeleton-text"></div>
                    <div className="skeleton-text short"></div>
                    <div className="skeleton-button"></div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="empty-products">
                <div className="empty-icon">📦</div>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms</p>
                <button
                  className="reset-filters-btn"
                  onClick={() => setFilter({ search: "", category: "all", status: "all" })}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {products.map((product) => (
                  <div key={product._id} className="product-card">
                    <div className="product-info">
                      <div className="product-header">
                        <h3>{product.name}</h3>
                        <span className="category-badge">{product.category}</span>
                      </div>
                      <p className="product-description">{product.description}</p>
                      <p className="product-price">₹{product.price}</p>
                      <p className={`product-stock ${product.stock <= 5 ? 'low-stock' : ''}`}>
                        Stock: {product.stock} {product.stock <= 5 && '(Low Stock)'}
                      </p>
                    </div>
                    <button
                      className="add-product-btn"
                      onClick={() => handleProductSelect(product)}
                      disabled={product.stock === 0 || loading}
                    >
                      {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Products Cart */}
          <div className="cart-section">
            <div className="cart-header">
              <h2>Your Cart</h2>
              {selectedProducts.length > 0 && (
                <span className="cart-count">{selectedProducts.length} items</span>
              )}
            </div>
            {selectedProducts.length === 0 ? (
              <div className="empty-cart">
                <div className="empty-cart-icon">🛒</div>
                <h3>Your cart is empty</h3>
                <p>Add products to start shopping</p>
              </div>
            ) : (
              <div className="cart-items">
                {selectedProducts.map((product) => (
                  <div key={product._id} className="cart-item">
                    <div className="cart-item-info">
                      <h4>{product.name}</h4>
                      <p className="cart-item-price">₹{product.price} each</p>
                      <p className="cart-item-subtotal">
                        Subtotal: ₹{product.price * product.quantity}
                      </p>
                      {product.quantity >= product.stock && (
                        <p className="stock-warning">
                          ⚠️ Maximum stock reached
                        </p>
                      )}
                    </div>
                    <div className="cart-item-controls">
                      <div className="quantity-controls">
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              product._id,
                              product.quantity - 1,
                            )
                          }
                          disabled={product.quantity <= 1}
                          className="quantity-btn"
                        >
                          -
                        </button>
                        <span className="quantity-display">{product.quantity}</span>
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              product._id,
                              product.quantity + 1,
                            )
                          }
                          disabled={product.quantity >= product.stock}
                          className="quantity-btn"
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="remove-btn"
                        onClick={() => handleRemoveProduct(product._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                <div className="cart-summary">
                  <div className="cart-summary-details">
                    <div className="summary-item">
                      <span>Items ({selectedProducts.reduce((sum, p) => sum + p.quantity, 0)}):</span>
                      <span>₹{calculateTotal()}</span>
                    </div>
                    <div className="summary-item shipping">
                      <span>Shipping:</span>
                      <span>FREE</span>
                    </div>
                    <div className="summary-item total">
                      <strong>Total:</strong>
                      <strong>₹{calculateTotal()}</strong>
                    </div>
                  </div>
                  <button
                    className="checkout-btn"
                    onClick={handleStripePayment}
                    disabled={loading || selectedProducts.length === 0}
                  >
                    {loading ? "Processing..." : "Proceed to Payment"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <TablePagination
          component="div"
          count={total || 0}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          sx={{ borderTop: "1px solid", borderColor: "divider" }}
        />

        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default PaymentPage;
