const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const validateItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    weather: Joi.string().required().valid("hot", "warm", "cold").messages({
      "string.empty": 'The "weather" field must be filled in',
      "any.only": 'The "weather" field must be one of: hot, warm, cold',
      "any.required": 'The "weather" field is required',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),
  }),
});

const validateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),
    email: Joi.string().required().email().messages({
      "string.empty": "Email is required",
      "string.email": "Please provide a valid email address",
      "any.required": "Email field is required",
    }),
    password: Joi.string().required().min(8).messages({
      "string.min": 'The minimum length of the "password" field is 8',
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": "Email is required",
      "string.email": "Please provide a valid email address",
      "any.required": "Email field is required",
    }),
    password: Joi.string().required().min(8).messages({
      "string.min": 'The minimum length of the "password" field is 8',
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

const validateProfileChanges = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),
  }),
});

const validateId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
    itemId: Joi.string().required().hex().length(24),
  }),
});

const validateItemId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().required().hex().length(24),
  }),
});

module.exports = {
  validateItem,
  validateId,
  validateLogin,
  validateUser,
  validateProfileChanges,
  validateItemId,
};
