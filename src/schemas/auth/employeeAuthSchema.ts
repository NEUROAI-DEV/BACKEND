import Joi from 'joi'

export const employeeLoginSchema = Joi.object({
  userWhatsappNumber: Joi.string().required(),
  userPassword: Joi.string().required(),
  userDeviceId: Joi.string().optional().allow('')
})

export const employeeRegistrationSchema = Joi.object({
  userName: Joi.string().optional().allow(''),
  userWhatsappNumber: Joi.string().required(),
  userPassword: Joi.string().min(6).required(),
  userDeviceId: Joi.string().optional().allow(''),
  userInvitationCode: Joi.string().required()
})

export const userUpdatePasswordSchema = Joi.object({
  userPassword: Joi.string().min(6).required(),
  userWhatsappNumber: Joi.string().required()
})
