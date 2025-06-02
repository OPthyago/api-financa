import { LogRepository } from '../../data/protocols/log-repository'
import { serverError } from '../../presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
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
  return new ControllerStub()
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
  controllerStub: Controller
  logErrorRepositoryStub: LogRepository
}

const makeSut = (): SutTypes => {
  const controllerStub = makeControllerStub()
  const logErrorRepositoryStub = makeLogErrorRepositoryStub()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
  }
}

describe('Log Error Decorator', () => {
  test('should call Controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const controllerSpy = jest.spyOn(controllerStub, 'handle')
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com', // More specific
        password: 'any_password',
        passwordConfirmation: 'any_password' // Corrected confirmation
      }
    }
    await sut.handle(httpRequest)
    expect(controllerSpy).toHaveBeenCalledWith(httpRequest) // Verify it's called with the request
  })

  test('should return the same HttpResponse as Controller', async () => {
    const { sut } = makeSut()
    const httpRequest = { // Same request as in the first test for consistency
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    // The default controllerStub returns a 200 response
    const expectedResponse: HttpResponse = {
      statusCode: 200,
      body: {
        name: 'valid_response'
      }
    }
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(expectedResponse)
  })

  test('should call LogErrorRepository with correct error stack if Controller returns a ServerError', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const fakeError = new Error()
    fakeError.stack = 'any_stack'
    // Use the actual serverError helper to construct the response, as the decorator relies on its structure
    const errorResponse = serverError(fakeError)
    jest.spyOn(controllerStub, 'handle').mockResolvedValueOnce(errorResponse) // Use mockResolvedValueOnce for cleaner async mock

    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    const httpRequest = {
      body: {
        // request body can be anything for this test
      }
    }
    await sut.handle(httpRequest)
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })

  test('should not call LogErrorRepository if Controller returns success (200 OK)', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    // Default controllerStub returns 200 OK
    jest.spyOn(controllerStub, 'handle').mockResolvedValueOnce({
      statusCode: 200,
      body: { data: 'success' }
    })
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    const httpRequest = { body: {} }
    await sut.handle(httpRequest)
    expect(logSpy).not.toHaveBeenCalled()
  })

  test('should not call LogErrorRepository if Controller returns a non-server error (e.g. 400 Bad Request)', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    jest.spyOn(controllerStub, 'handle').mockResolvedValueOnce({
      statusCode: 400, // Example of a non-server error
      body: { error: 'Bad Request' }
    })
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    const httpRequest = { body: {} }
    await sut.handle(httpRequest)
    expect(logSpy).not.toHaveBeenCalled()
  })

  test('should rethrow and not log if underlying controller throws an unhandled exception', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const testError = new Error('ControllerThrewError')
    jest.spyOn(controllerStub, 'handle').mockRejectedValueOnce(testError) // Controller throws an error

    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    const httpRequest = { body: {} }

    await expect(sut.handle(httpRequest)).rejects.toThrow(testError)
    expect(logSpy).not.toHaveBeenCalled()
  })
})
