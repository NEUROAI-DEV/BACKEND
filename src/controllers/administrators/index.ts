import { createBillingPlan } from './billingPlan/create'
import { findAllBillingPlan } from './billingPlan/findAll'
import { updateBillingPlan } from './billingPlan/update'
import { findAllSubscription } from './subscription/findAllSubscription'
import { updateSubscription } from './subscription/updateSubscription'
import { findAllTransaction } from './transaction/findAll'
import { updateTransaction } from './transaction/updateTransaction'

export const administratorController = {
  findAllSubscription,
  updateSubscription,
  findAllTransaction,
  updateTransaction,
  findAllBillingPlan,
  updateBillingPlan,
  createBillingPlan
}
