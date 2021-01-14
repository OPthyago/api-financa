import validator from 'validator'
import { EmailValidatorAdapter } from './email-validator-adapter'

jest.mock('validator', () => ({
  isEmail (email: string): boolean {
    return true
  }
}))

const makeSut = (): EmailValidatorAdapter => {
  const sut = new EmailValidatorAdapter()
  return sut
}

describe('Email Validator Adapter', () => {
  test('should call validator with correct value', () => {
    const sut = makeSut()
    const validatorSpy = jest.spyOn(validator, 'isEmail')
    sut.isValid('valid@email.com')
    expect(validatorSpy).toHaveBeenCalledWith('valid@email.com')
  })

  test('should return true if validator returns true ', () => {
    const sut = makeSut()
    const isValid = sut.isValid('valid@email.com')
    expect(isValid).toBe(true)
  })

  test('should return false if validator returns false ', () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('valid@email.com')
    expect(isValid).toBe(false)
  })
})
