export interface PasswordRecoveryRequest {
  email: string,
  verificationCode: string,
  newPassword: string
}
