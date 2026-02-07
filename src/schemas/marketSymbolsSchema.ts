import Joi from 'joi'

export const findUsdtSymbolsSchema = Joi.object({
  search: Joi.string().allow('', null).optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20)
})
