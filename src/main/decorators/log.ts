import { LogRepository } from '../../data/protocols/log-repository'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'

export class LogControllerDecorator implements Controller {
  private readonly controller: Controller
  private readonly logRepository: LogRepository

  constructor (controller: Controller, logRepository: LogRepository) {
    this.controller = controller
    this.logRepository = logRepository
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse: HttpResponse = await this.controller.handle(httpRequest)
    return httpResponse
  }
}
