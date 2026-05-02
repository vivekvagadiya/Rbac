// services/activityLog.service.js
const ActivityLog = require("../models/activity.model.js");

exports.createLog = async ({
  userId,
  action,
  resource,
  resourceId,
  description,
  metadata,
  req,
  status = "SUCCESS",
}) => {
  try {
    await ActivityLog.create({
      userId,
      action,
      resource,
      resourceId,
      description,
      metadata,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      status,
    });
  } catch (err) {
    console.error("Activity log failed:", err.message);
  }
};

exports.getLogs = async ({
  page = 1,
  limit = 10,
  action,
  resource,
  status,
  userId,
  fromDate,
  toDate,
  search,
}) => {
  const query = {};

  // filters
  if (action) query.action = action;
  if (resource) query.resource = resource;
  if (status) query.status = status;
  if (userId) query.userId = userId;

  // date range
  if (fromDate || toDate) {
    query.createdAt = {};
    if (fromDate) query.createdAt.$gte = new Date(fromDate);
    if (toDate) query.createdAt.$lte = new Date(toDate);
  }

  // search (description)
  if (search) {
    query.description = { $regex: search, $options: "i" };
  }

  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    ActivityLog.find(query)
      .populate("userId", "name email") // optional
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    ActivityLog.countDocuments(query),
  ]);

  return {
    data: logs,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit),
    },
  };
};