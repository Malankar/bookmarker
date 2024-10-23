import Joi from 'joi';

const bookmarkSchema = Joi.object({
  title: Joi.string().max(255).required(),
  url: Joi.string().uri().required()
});

export { bookmarkSchema };