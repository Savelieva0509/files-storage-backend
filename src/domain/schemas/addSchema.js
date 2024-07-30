const Joi = require("joi");

const addSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  size: Joi.number()
    .min(1024)
    .max(7 * 1024 * 1024 * 1024)
    .required(),
});

module.exports = { addSchema };
