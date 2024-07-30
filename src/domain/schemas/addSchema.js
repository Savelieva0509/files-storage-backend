const Joi = require("joi");

const addSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
});

module.exports = { addSchema };
