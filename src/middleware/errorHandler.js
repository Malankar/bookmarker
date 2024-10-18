import Joi from "joi";

const errorHandler = (err, req, res, next) => {
  const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;

  const errorResponse = {
    url: fullUrl,
    path: req.path,
    method: req.method,
    status: Joi.isError(err) ? 400 : err.status || 500,
    message: err.message,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  };

  return res.status(errorResponse.status).json(errorResponse);
};

export default errorHandler;
