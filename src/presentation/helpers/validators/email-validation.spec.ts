import { InvalidParamError } from '../../error'
import { EmailValidation } from './email-validation' // Corrected path after move
import { EmailValidator } from '../../protocols/email-validator' // Assuming a more generic path for the protocol

const makeEmailValidatorStub = (): EmailValidator => { // Renamed for clarity (Stub)
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

interface SutTypes {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorStub()
  const sut = new EmailValidation('email', emailValidatorStub) // Pass the stub
  return {
    sut: sut,
    emailValidatorStub: emailValidatorStub
  }
}

describe('EmailValidation', () => { // Updated describe block name
  test('Should return InvalidParamError if EmailValidator returns false', () => { // Renamed test
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const error = sut.validate({ email: 'invalid_email@mail.com' })
    expect(error).toEqual(new InvalidParamError('email'))
  })

  test('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    sut.validate({ email: 'any_email@mail.com' })
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should return null if EmailValidator returns true', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(true) // Default is true, but explicit for clarity
    const error = sut.validate({ email: 'valid_email@mail.com' })
    expect(error).toBeNull()
  })

  test('Should throw if EmailValidator throws', () => { // Renamed test
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error('EmailValidatorFailed')
    })
    // Check that the validate method itself throws, not sut.validate which is a reference to the method
    expect(() => { sut.validate({ email: 'any_email@mail.com' }) }).toThrow('EmailValidatorFailed')
  })
})
