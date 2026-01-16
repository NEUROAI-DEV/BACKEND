import { IPaginationRequest } from '../shared/paginationRequest.interface'

export interface IEmployeeFindAllRequest extends IPaginationRequest {}

export interface IEmployeeFindDetailRequest extends IPaginationRequest {
  employeeId: number
}

export interface IEmployeeUpdateRequest {
  userId: number
  userWhatsappNumber: string
  userDeviceId: string
}
