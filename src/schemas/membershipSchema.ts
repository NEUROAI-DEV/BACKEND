import Joi from 'joi'
import { jwtPayloadSchema } from './jwtPayloadSchema'

export const membershipFindAllSchema = Joi.object({
  jwtPayload: jwtPayloadSchema,
  page: Joi.number().integer().optional(),
  size: Joi.number().integer().optional(),
  search: Joi.string().optional().allow(''),
  pagination: Joi.boolean().optional()
})

export const membershipRemoveSchema = Joi.object({
  jwtPayload: jwtPayloadSchema,
  membershipId: Joi.number().integer().positive().required()
})

export const membershipUpdateSchema = Joi.object({
  jwtPayload: jwtPayloadSchema,
  membershipId: Joi.number().integer().positive().required(),
  membershipStatus: Joi.string().valid('active', 'pending', 'rejected').optional(),
  membershipOfficeId: Joi.number().integer().positive().allow(null).optional()
})

export const membershipInviteSchema = Joi.object({
  jwtPayload: jwtPayloadSchema,
  inviteCode: Joi.string().required()
})
