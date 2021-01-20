import { InvalidParamError } from '../../error'
import { EmailValidator } from '../../protocols/email-validator'
import { Validator } from './validator'

export class EmailValidation implements Validator {
  private readonly fieldName: string
  private readonly emailValidator: EmailValidator

  constructor (email: string, emailValidator: EmailValidator) {
    this.fieldName = email
    this.emailValidator = emailValidator
  }

  validate (input: any): Error | null {
    if (!this.emailValidator.isValid(input[this.fieldName])) {
      return new InvalidParamError(this.fieldName)
    }
    return null
  }
}
