import { administratorLogin } from './administrator/login'
import { companyLogin } from './company/login'
import { companyRegister } from './company/register'
import { employeeLogin } from './employee/login'
import { employeeRegister } from './employee/register'
import { updatePassword } from './updatePassword'

export const authController = {
  employeeLogin,
  employeeRegister,
  companyRegister,
  companyLogin,
  administratorLogin,
  updatePassword
}
