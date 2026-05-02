const activityLogService = require("../services/activityLog.service");

exports.withActivityLog = (handler, config) => {
  return async (req, res, next) => {
    try {
      const result = await handler(req, res, next);

      const logData =
        typeof config === "function" ? config(req, result) : config;

      await activityLogService.createLog({
        userId: req.user?._id,
        req,
        status: "SUCCESS",
        ...logData,
      });

      return result;
    } catch (err) {
      try {
        const logData =
          typeof config === "function" ? config(req, null, err) : config;

        await activityLogService.createLog({
          userId: req.user?._id,
          req,
          status: "FAIL",
          action: logData?.action || "UNKNOWN",
          resource: logData?.resource || "UNKNOWN",
          resourceId: req.params.id || null,
          description: err.message,
        });
      } catch (logErr) {
        console.error("Logging failed:", logErr.message);
      }

      if (!res.headersSent) {
        next(err);
      }
    }
  };
};
