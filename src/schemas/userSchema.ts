import { z } from 'zod'

const stringAllowEmpty = () => z.string().or(z.literal(''))

export const findAllUsersSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  size: z.coerce.number().int().min(1).default(10),
  search: stringAllowEmpty()
    .optional()
    .transform((v) => (v === '' ? undefined : v)),
  pagination: z
    .string()
    .optional()
    .transform((v) => v === 'true')
})

export type IFindAllUser = z.infer<typeof findAllUsersSchema>

export const CreateAdminUserSchema = z.object({
  userName: z.string().min(1).max(100),
  userEmail: z.string().email(),
  userPassword: z.string().min(6)
})

export const UpdateAdminUserSchema = z.object({
  userId: z.coerce.number().int().positive(),
  userName: z.string().min(1).max(100).optional(),
  userEmail: z.string().email().optional(),
  userPassword: z.string().min(6).optional()
})

export const RemoveAdminUserSchema = z.object({
  userId: z.coerce.number().int().positive()
})

export type ICreateAdminUser = z.infer<typeof CreateAdminUserSchema>
export type IUpdateAdminUser = z.infer<typeof UpdateAdminUserSchema>
export type IRemoveAdminUser = z.infer<typeof RemoveAdminUserSchema>
