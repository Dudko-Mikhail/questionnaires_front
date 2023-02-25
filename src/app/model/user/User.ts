import {IUser} from "./IUser";

export class User implements IUser {
  id: number
  email: string
  phoneNumber: string = ''
  firstName: string = ''
  lastName: string = ''

  constructor(userInfo?: IUser) {
    if (userInfo) {
      if (userInfo.id) {
        this.id = userInfo.id
      }
      this.email = userInfo.email
      this.phoneNumber = userInfo.phoneNumber ? userInfo.phoneNumber : ''
      this.firstName = userInfo.firstName ? userInfo.firstName : ''
      this.lastName = userInfo.lastName ? userInfo.lastName : ''
    }
  }

  getFullNameOrEmail(): string {
    if (!this.firstName && !this.lastName) {
      return this.email
    }
    return `${this.firstName} ${this.lastName}`.trim()
  }
}
