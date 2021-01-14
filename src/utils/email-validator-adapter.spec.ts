import validator from 'validator'
import { EmailValidatorAdapter } from './email-validator-adapter'

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
})
