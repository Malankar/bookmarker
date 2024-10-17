import Joi from 'joi';

const errorHandler = (err, req, res, next) => {
  if (Joi.isError(err)) {
    return res.status(400).json({
      type: 'ValidationError',
      message: err.details.map(detail => detail.message).join(', '),
    });
  }

  return res.status(500).json({
    type: 'Internal Server Error',
    message: err.message,
  });
};

export default errorHandler;