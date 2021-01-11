import { HttpResponse } from '../protocol/httpResponse'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})
