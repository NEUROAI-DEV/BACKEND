import { findAllUsers } from './findAllUsers'
import { createAdminUser } from './createAdmin'
import { updateAdminUser } from './updateAdmin'
import { removeAdminUser } from './removeAdmin'
import { findAllAdmins } from './findAllAdmins'

export const UserController = {
  findAll: findAllUsers,
  createAdmin: createAdminUser,
  updateAdmin: updateAdminUser,
  removeAdmin: removeAdminUser,
  findAllAdmins: findAllAdmins
}
