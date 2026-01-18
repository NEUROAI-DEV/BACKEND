export interface IotpRequest {
  userEmail: string
  otpType: 'register' | 'reset'
}

export interface IotpVerify {
  userEmail: string
  otpCode: string
}
