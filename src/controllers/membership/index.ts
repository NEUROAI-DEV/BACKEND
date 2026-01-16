import { findAllMembership } from './findAll'
import { inviteMembership } from './invite'
import { removeMembership } from './remove'
import { updateMembership } from './update'

export const membershipControllers = {
  findAll: findAllMembership,
  invite: inviteMembership,
  update: updateMembership,
  remove: removeMembership
}
