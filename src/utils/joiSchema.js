import Joi from 'joi';

const titleSchema = Joi.string().max(255).required().messages({
  'string.base': 'Should be a type of text, INVALID_TYPE',
  'string.empty': 'Cannot be empty, EMPTY',
  'string.max': 'Should have a maximum length of 255 characters, TOO_LONG',
  'any.required': 'Field is required, MISSING'
});

const urlSchema = Joi.string().uri().required().messages({
  'string.base': 'Should be a type of text, INVALID_TYPE',
  'string.empty': 'Cannot be empty, EMPTY',
  'string.uri': 'Must be a valid URI, INVALID_URI',
  'any.required': 'Field is required, MISSING'
});

const bookmarkSchema = Joi.object({
  title: titleSchema,
  url: urlSchema
});

const bookmarkUpdateSchema = Joi.object({
  title: titleSchema.optional(),
  url: urlSchema.optional()
});

export { bookmarkSchema, bookmarkUpdateSchema };