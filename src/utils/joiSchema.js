import Joi from 'joi';

const bookmarkSchema = Joi.object({
  title: Joi.string().max(255).required().messages({
    'string.base': 'Should be a type of text',
    'string.empty': 'Cannot be empty',
    'string.max': 'Should have a maximum length of 255 characters',
    'any.required': 'Field is required'
  }),
  url: Joi.string().uri().required().messages({
    'string.base': 'Should be a type of text',
    'string.empty': 'Cannot be empty',
    'string.uri': 'Must be a valid URI',
    'any.required': 'Field is required'
  })
});

export { bookmarkSchema };