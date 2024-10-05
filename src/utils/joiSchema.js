const Joi = require("joi");

const bookmarkSchema = Joi.object({
  title: Joi.string().max(255),
  url: Joi.string().uri()
});

module.exports = { bookmarkSchema };
