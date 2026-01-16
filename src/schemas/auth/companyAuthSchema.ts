import Joi from 'joi'

const userRegisterSchema = Joi.object({
  userName: Joi.string().optional().allow(''),
  userWhatsappNumber: Joi.string().required(),
  userPassword: Joi.string().min(6).required()
})

const companyRegisterSchema = Joi.object({
  companyName: Joi.string().max(100).required(),
  companyIndustry: Joi.string().optional().allow('')
})

export const companyrRegistrationSchema = Joi.object({
  user: userRegisterSchema,
  company: companyRegisterSchema
})

export const companyLoginSchema = Joi.object({
  userWhatsappNumber: Joi.string().required(),
  userPassword: Joi.string().required()
})

export const companyUpdatePasswordSchema = Joi.object({
  userPassword: Joi.string().min(6).required(),
  userWhatsappNumber: Joi.string().required()
})
