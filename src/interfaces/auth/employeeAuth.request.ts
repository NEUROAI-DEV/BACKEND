export interface IEmployeeRegisterRequest {
  userId: number
  userName: string
  userPassword: string
  userWhatsappNumber: string
  userRole: 'admin' | 'superAdmin' | 'user'
  userDeviceId: string
  userInvitationCode: string
}

export interface IEmployeeLoginRequest {
  userPassword: string
  userWhatsappNumber: string
  userDeviceId?: string
}
