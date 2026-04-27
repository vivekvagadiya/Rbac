import * as orderService from "../services/order.service.js";

export const createOrder = async (req, res, next) => {
  try {
    const order = await orderService.createOrder(
      req.body,
      req.user._id
    );

    return res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const result = await orderService.getOrders(req.query);

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

    const allowedStatuses = [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const order = await orderService.updateOrderStatus(
      id,
      status,
      req.user._id
    );

    return res.status(200).json({
      success: true,
      data: order,
    });
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

    return res.status(200).json({
      success: true,
      data: order,
    });
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