export interface IotpRequest {
  whatsappNumber: string
  otpType: 'register' | 'reset'
}

export interface IotpVerify {
  whatsappNumber: string
  otpCode: string
}
