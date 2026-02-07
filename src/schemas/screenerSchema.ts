import Joi from 'joi'

export const createScreenerSchema = Joi.object({
  screenerCoinSymbol: Joi.string().max(100).required().trim(),
  screenerProfile: Joi.string()
    .valid('SCALPING', 'SWING', 'INVEST')
    .required()
})

export const findAllScreenerSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().allow('').optional().trim()
})
