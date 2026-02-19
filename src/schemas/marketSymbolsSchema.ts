import Joi from 'joi'

export const findUsdtSymbolsSchema = Joi.object({
  search: Joi.string().allow('', null).optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20)
})

const coinGeckoOrderValues = [
  'market_cap_desc',
  'market_cap_asc',
  'volume_desc',
  'volume_asc',
  'id_asc',
  'id_desc'
] as const

export const findAllCoinSchema = Joi.object({
  vs_currency: Joi.string().allow('', null).optional().default('usd'),
  order: Joi.string()
    .valid(...coinGeckoOrderValues)
    .optional()
    .default('market_cap_desc'),
  per_page: Joi.number().integer().min(1).max(250).default(20),
  page: Joi.number().integer().min(1).default(1),
  search: Joi.string().allow('', null).optional()
})
