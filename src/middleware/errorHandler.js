import Joi from "joi";

const errorHandler = (err, req, res, next) => {
  let status = err.status ? err.status : 500;
  let errorResponse = {};
  if (Joi.isError(err)) {
    errorResponse = {
      message: "Invalid request data. Please review the request and try again.",
      errors: err.details.map((error) => {
        const [msg, code] = error.message.split(",");
        return {
          message: msg,
          field: error.context.label,
          code: code || "UNKNOWN_CODE",
        };
      }),
    };
    status = 400;
  } else {
    errorResponse = {
      message:
        status == 500
          ? "Internal server error. Please try again later."
          : err.message,
    };
  }

  if (status == 500) console.error(`Internal Server Error: \n${err}`);

  return res.status(status).json(errorResponse);
};

export default errorHandler;
