import { type Request } from 'express'
import { IJwtPayload } from './jwt.interface'
import { IMembershipAttributes } from '../membership/membership.dto'

export interface IAuthenticatedRequest extends Request {
  jwtPayload?: IJwtPayload
  membershipPayload?: IMembershipAttributes
}
