import { LogRepository } from '../../data/protocols/log-repository'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

const makeControllerStub = (): Controller => {
  class ControllerSutb implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: {
          name: 'valid_response'
        }
      }
      return new Promise(resolve => resolve(httpResponse))
    }
  }
  return new ControllerSutb()
}

const makeLogErrorRepositoryStub = (): LogRepository => {
  class LogErrorRepositoryStub {
    async logError (stack: string): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new LogErrorRepositoryStub()
}

interface SutTypes {
  sut: LogControllerDecorator
  controllerSutb: Controller
  logErrorRepositoryStub: LogRepository
}

const makeSut = (): SutTypes => {
  const controllerSutb = makeControllerStub()
  const logErrorRepositoryStub = makeLogErrorRepositoryStub()
  const sut = new LogControllerDecorator(controllerSutb, logErrorRepositoryStub)
  return {
    sut,
    controllerSutb,
    logErrorRepositoryStub
  }
}

describe('Log Error Decorator', () => {
  test('should call Controller handle', async () => {
    const { sut, controllerSutb } = makeSut()
    const controllerSpy = jest.spyOn(controllerSutb, 'handle')
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        passwordConfirmation: 'any_passwordConfirmation'
      }
    }
    await sut.handle(httpRequest)
    expect(controllerSpy).toHaveBeenCalled()
  })

  test('should return the same as Controller', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        passwordConfirmation: 'any_passwordConfirmation'
      }
    }
    const httpResponse: HttpResponse = {
      statusCode: 200,
      body: {
        name: 'valid_response'
      }
    }
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(httpResponse)
  })
})
