import { MissingParamError, ServerError } from '../../error'
import { badRequest } from '../../helpers/http/http-helper'
import { Validator } from '../../protocols/validator'
import { HttpRequest } from '../../protocols'
import { SignUpController } from './signup'
import { AccountModel, AddAccount, AddAccountModel } from './signup-protocols'

const makeHttpRequest = (): HttpRequest => ({
  body: {
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password',
    passwordConfirmation: 'valid_password'
  }
})

const makeValidation = (): Validator => {
  class ValidationStub implements Validator {
    validate (input: any): Error | null {
      return null
    }
  }
  return new ValidationStub()
}

const makeAddAccountSub = (): AddAccount => {
  class AddAccountSub implements AddAccount {
    add (account: AddAccountModel): Promise<AccountModel> {
      const validAccount = {
        id: 1,
        name: 'valid_name',
        email: 'valid_email',
        password: 'valid_password'
      }
      return new Promise(resolve => resolve(validAccount))
    }
  }
  return new AddAccountSub()
}

interface SutTypes {
  sut: SignUpController
  addAccountSub: AddAccount
  validationSub: Validator
}

const makeSut = (): SutTypes => {
  const validationSub = makeValidation()
  const addAccountSub = makeAddAccountSub()
  const sut = new SignUpController(addAccountSub, validationSub)
  return {
    sut,
    addAccountSub,
    validationSub
  }
}

describe('SignUp Controller', () => {
  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountSub } = makeSut()
    const addAccountSpy = jest.spyOn(addAccountSub, 'add')
    const httpRequest = makeHttpRequest()
    await sut.handle(httpRequest)
    expect(addAccountSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    })
  })

  test('Should return 500 if AddAccount Throws', async () => {
    const { sut, addAccountSub } = makeSut()
    jest.spyOn(addAccountSub, 'add').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = makeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 200 if valid data is provided ', async () => {
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual(
      {
        id: 1,
        name: 'valid_name',
        email: 'valid_email',
        password: 'valid_password'
      }
    )
  })

  test('Should call Validation with correct values', async () => {
    const { sut, validationSub } = makeSut()
    const validateSpy = jest.spyOn(validationSub, 'validate')
    const httpRequest = makeHttpRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if validator return an error', async () => {
    const { sut, validationSub } = makeSut()
    jest.spyOn(validationSub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpRequest = makeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
