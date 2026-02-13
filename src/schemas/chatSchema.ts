import Joi from 'joi'

export const chatRequestSchema = Joi.object({
  message: Joi.string().min(1).required(),
  context: Joi.string().allow('', null)
})

const chatChunkSchema = Joi.object({
  content: Joi.string().min(1).required(),
  source: Joi.string().allow('', null)
})

export const indexChatRequestSchema = Joi.object({
  documents: Joi.array().items(chatChunkSchema).min(1).max(100).required()
})

export const findAllIndexingsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  size: Joi.number().integer().min(1).max(100).default(20),
  source: Joi.string().allow('', null).optional(),
  sourceType: Joi.string().valid('pdf', 'json').allow('', null).optional(),
  search: Joi.string().allow('', null).optional()
})

export const deleteIndexingParamsSchema = Joi.object({
  id: Joi.string().pattern(/^\d+$/).required().messages({
    'string.pattern.base': 'id must be a positive integer'
  })
})
