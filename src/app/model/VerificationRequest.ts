export class VerificationRequest {
  constructor(public email: string = '', public verificationCode: string = '') {
  }
}
