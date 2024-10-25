import Joi from 'joi';

const bookmarkSchema = Joi.object({
  title: Joi.string().max(255).required().messages({
    'string.base': 'Should be a type of text, INVALID_TYPE',
    'string.empty': 'Cannot be empty, EMPTY',
    'string.max': 'Should have a maximum length of 255 characters, TOO_LONG',
    'any.required': 'Field is required, MISSING'
  }),
  url: Joi.string().uri().required().messages({
    'string.base': 'Should be a type of text, INVALID_TYPE',
    'string.empty': 'Cannot be empty, EMPTY',
    'string.uri': 'Must be a valid URI, INVALID_URI',
    'any.required': 'Field is required, MISSING'
  })
});

export { bookmarkSchema };