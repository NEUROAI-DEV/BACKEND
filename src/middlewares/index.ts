import { useAuthorization } from './access'
import { allowAppRoles } from './appRole'

export const middleware = {
  useAuthorization,
  allowAppRoles
}
