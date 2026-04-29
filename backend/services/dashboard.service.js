import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
export const dashboardStats = async () => {
  const [userCount, orderCount, productCount, revenueData] = await Promise.all([
    User.countDocuments(),
    Order.countDocuments(),
    Product.countDocuments(),
    Order.aggregate([
      {
        $match: { status: "cancelled" },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
        },
      },
    ]),
  ]);
  const revenue = revenueData.length > 0 ? revenueData[0].total : 0;
  return {
    users: userCount,
    orders: orderCount,
    products: productCount,
    revenue: revenue,
  };
};
