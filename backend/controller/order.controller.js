import emailService from "../services/email.service.js";
import * as orderService from "../services/order.service.js";

export const createOrder = async (req, res, next) => {
  try {
    const order = await orderService.createOrder(
      req.body,
      req.user._id
    );

    res.status(201).json({
      success: true,
      data: order,
    });
    return order
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const result = await orderService.getOrders(req.query,req.user);

    return res.status(200).json({
      success: true,
      data: result.orders,
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await orderService.updateOrderStatus(
      id,
      status,
      req.user._id
    );

    // Get populated order data for email
    const populatedOrder = await orderService.getOrderById(id);

    // Send email to the actual order customer, not the admin updating it
    emailService.sendOrderStatusEmail(populatedOrder.user, populatedOrder, status).catch(error => {
      console.error('Failed to send order status email:', error.message);
    });

    res.status(200).json({
      success: true,
      data: order,
    });
    return order
  } catch (error) {
    next(error);
  }
};

export const refundOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await orderService.refundOrder(
      id,
      req.user._id
    );

    res.status(200).json({
      success: true,
      data: order,
    });
    return order
  } catch (error) {
    next(error);
  }
};

export const getOrderById=async(req,res,next)=>{
  try {
    const {id}=req.params;
    const order=await orderService.getOrderById(id)

    return res.status(200).json({
      success:true,
      data:order,
    })
  } catch (error) {
    next(error)
    
  }
}

export const getOrderStatusSummaryController = async (req, res, next) => {
  try {
    const data = await orderService.getOrderStatusSummary();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};