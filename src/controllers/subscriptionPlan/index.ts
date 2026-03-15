import { createSubscriptionPlan } from './create'
import { findAllSubscriptionPlan } from './findAll'
import { findDetailSubscriptionPlan } from './findDetail'
import { updateSubscriptionPlan } from './update'
import { removeSubscriptionPlan } from './remove'

export const SubscriptionPlanController = {
  findAll: findAllSubscriptionPlan,
  findDetail: findDetailSubscriptionPlan,
  create: createSubscriptionPlan,
  update: updateSubscriptionPlan,
  remove: removeSubscriptionPlan
}
