import { HttpRequest, HttpResponse } from './httpResponse'

export interface Controller {
  handle(httpRequest: HttpRequest): HttpResponse
}
