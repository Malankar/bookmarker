import Joi from 'joi';

const bookmarkSchema = Joi.object({
  title: Joi.string().max(255).required(),
  url: Joi.string().uri().required()
});

const userSchema = Joi.object({
  username: Joi.string().min(3).max(255).required(),
  password: Joi.string().min(255).required()
});

export { bookmarkSchema };