import { findAllUsers } from './findAllUsers'
import { createAdminUser } from './createAdmin'
import { updateAdminUser } from './updateAdmin'
import { removeAdminUser } from './removeAdmin'

export const UserController = {
  findAll: findAllUsers,
  createAdmin: createAdminUser,
  updateAdmin: updateAdminUser,
  removeAdmin: removeAdminUser
}
