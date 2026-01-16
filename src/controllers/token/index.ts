import { findAllEmployee } from './findAll'
import { findDetailEmployee } from './findDetail'
import { updateEmployee } from './update'

export const employeeController = {
  findAll: findAllEmployee,
  findDetail: findDetailEmployee,
  update: updateEmployee
}
