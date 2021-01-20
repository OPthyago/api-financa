import { InvalidParamError } from '../../error'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { Validator } from '../../helpers/validators/validator'
import { AddAccount, Controller, EmailValidator, HttpRequest, HttpResponse } from './signup-protocols'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount
  private readonly validators: Validator
  constructor (
    emailValidator: EmailValidator,
    addAccount: AddAccount,
    validators: Validator
  ) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
    this.validators = validators
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { name, email, password, passwordConfirmation } = httpRequest.body

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParamError('email'))
      }

      const account = await this.addAccount.add({
        name,
        email,
        password
      })

      return ok(account)
    } catch (error) {
      return serverError()
    }
  }
}
