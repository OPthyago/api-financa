import { MissingParamError } from '../error/missing-param-error'
import { badRequest } from '../helpres/http-helper'
import { Controller } from '../protocol/controller'
import { HttpRequest, HttpResponse } from '../protocol/httpResponse'

export class SignUpController implements Controller {
  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredParam = ['name']
    for (const field of requiredParam) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }

    return {
      statusCode: 200
    }
  }
}
