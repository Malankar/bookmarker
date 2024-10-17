import Joi from 'joi';

const bookmarkSchema = Joi.object({
  title: Joi.string().max(255),
  url: Joi.string().uri()
});

export { bookmarkSchema };