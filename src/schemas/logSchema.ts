import Joi from 'joi'

export const createLogSchema = Joi.object({
  logLevel: Joi.string().valid('error', 'warn', 'info').required(),
  logMessage: Joi.string().required(),
  logSource: Joi.string().max(255).allow('', null).optional(),
  logMeta: Joi.string().allow('', null).optional()
})

export const findAllLogsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  size: Joi.number().integer().min(1).max(100).default(20),
  level: Joi.string().valid('error', 'warn', 'info').allow('', null).optional(),
  search: Joi.string().allow('', null).optional(),
  pagination: Joi.boolean().optional()
})
