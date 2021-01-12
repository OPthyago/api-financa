import { InvalidParamError, MissingParamError } from '../../error'
import { badRequest } from '../../helpres/http-helper'
import { Controller } from '../../protocol/controller'
import { EmailValidator } from '../../protocol/email-validator'
import { HttpRequest, HttpResponse } from '../../protocol/httpResponse'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredParam = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredParam) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
    const { email } = httpRequest.body

    if (!this.emailValidator.isValid(email)) {
      return badRequest(new InvalidParamError('email'))
    }

    return {
      statusCode: 200
    }
  }
}
