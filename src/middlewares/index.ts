import { useAuthorization } from './access'
import { allowAppRoles } from './appRole'
import { allowMembershipRoles } from './membershipRoleGuard'
import { requestTimer } from './requestTimer'
import { subscriptionCheck } from './subsciptionCheck'

export const middleware = {
  useAuthorization,
  requestTimer,
  allowAppRoles,
  allowMembershipRoles,
  subscriptionCheck
}
