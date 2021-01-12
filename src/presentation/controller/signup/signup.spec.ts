import { AccountModel } from '../../../domain/models/account'
import { AddAccount, AddAccountModel } from '../../../domain/usecases/add-account'
import { InvalidParamError, MissingParamError, ServerError } from '../../error'
import { EmailValidator } from '../../protocol/email-validator'
import { SignUpController } from './signup'

const makeEmailValidatorSub = (): EmailValidator => {
  class EmailValidatorSub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorSub()
}

const makeAddAccountSub = (): AddAccount => {
  class AddAccountSub implements AddAccount {
    add (account: AddAccountModel): Promise<AccountModel> {
      const validAccount = {
        id: 'valid_id',
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
  emailValidatorSub: EmailValidator
  addAccountSub: AddAccount
}

const makeSut = (): SutTypes => {
  const emailValidatorSub = makeEmailValidatorSub()
  const addAccountSub = makeAddAccountSub()
  const sut = new SignUpController(emailValidatorSub, addAccountSub)
  return {
    sut,
    emailValidatorSub,
    addAccountSub
  }
}

describe('SignUp Controller', () => {
  test('Should return 400 if name is not provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('Should return 400 if email is not provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if password is not provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 400 if passwordConfirmation is not provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  test('Should return 400 if no passwordConfirmation is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  test('Should return 400 if no passwordConfirmation fails', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        passwordConfirmation: 'invalid_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  test('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorSub } = makeSut()
    jest.spyOn(emailValidatorSub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invaild_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('Should return 500 if EmailValidator Throws', async () => {
    const { sut, emailValidatorSub } = makeSut()
    jest.spyOn(emailValidatorSub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invaild_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 500 if AddAccount Throws', async () => {
    const { sut, addAccountSub } = makeSut()
    jest.spyOn(addAccountSub, 'add').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invaild_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})
