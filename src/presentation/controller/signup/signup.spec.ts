import { InvalidParamError, ServerError } from '../../error'
import { Validator } from '../../helpers/validators/validator'
import { SignUpController } from './signup'
import { AccountModel, AddAccount, AddAccountModel, EmailValidator } from './signup-protocols'

const makeValidation = (): Validator => {
  class ValidationStub implements Validator {
    validate (input: any): Error | null {
      return null
    }
  }
  return new ValidationStub()
}

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
  emailValidatorSub: EmailValidator
  addAccountSub: AddAccount
  validationSub: Validator
}

const makeSut = (): SutTypes => {
  const emailValidatorSub = makeEmailValidatorSub()
  const validationSub = makeValidation()
  const addAccountSub = makeAddAccountSub()
  const sut = new SignUpController(emailValidatorSub, addAccountSub, validationSub)
  return {
    sut,
    emailValidatorSub,
    addAccountSub,
    validationSub
  }
}

describe('SignUp Controller', () => {
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

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountSub } = makeSut()
    const addAccountSpy = jest.spyOn(addAccountSub, 'add')
    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
      }
    }
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
    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 200 if valid data is provided ', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
      }
    }
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
})
