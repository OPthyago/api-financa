import { AddAccount } from '../../../domain/usecases/add-account'
import { InvalidParamError, MissingParamError } from '../../error'
import { badRequest, serverError } from '../../helpres/http-helper'
import { Controller } from '../../protocol/controller'
import { EmailValidator } from '../../protocol/email-validator'
import { HttpRequest, HttpResponse } from '../../protocol/httpResponse'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount
  constructor (
    emailValidator: EmailValidator,
    addAccount: AddAccount
  ) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredParam = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredParam) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { name, email, password } = httpRequest.body

      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParamError('email'))
      }

      const account = await this.addAccount.add({
        name,
        email,
        password
      })

      return {
        statusCode: 200,
        body: account
      }
    } catch (error) {
      return serverError()
    }
  }
}
