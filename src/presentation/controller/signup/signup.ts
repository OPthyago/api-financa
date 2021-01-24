import { badRequest, ok, serverError } from '../../helpers/http/http-helper'
import { Validator } from '../../helpers/validators/validator'
import { AddAccount, Controller, HttpRequest, HttpResponse } from './signup-protocols'

export class SignUpController implements Controller {
  private readonly addAccount: AddAccount
  private readonly validators: Validator
  constructor (
    addAccount: AddAccount,
    validators: Validator
  ) {
    this.addAccount = addAccount
    this.validators = validators
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = this.validators.validate(httpRequest.body)
      if (validationError) {
        return badRequest(validationError)
      }
      const { name, email, password } = httpRequest.body
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
