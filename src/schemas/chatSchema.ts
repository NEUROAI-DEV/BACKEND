import Joi from 'joi'

export const chatRequestSchema = Joi.object({
  message: Joi.string().min(1).required(),
  context: Joi.string().allow('', null)
})

