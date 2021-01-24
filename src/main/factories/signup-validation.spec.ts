import { EmailValidator, ValidatorComposite } from '../../presentation/controller/signup/signup-protocols'
import { CompareFieldsValidation } from '../../presentation/helpers/validators/compare-fields-validation'
import { EmailValidation } from '../../presentation/helpers/validators/email-validation'
import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation'
import { Validator } from '../../presentation/protocols/validator'
import { makeSignUpValidator } from './signup-validator'

const makeEmailValidatorSub = (): EmailValidator => {
  class EmailValidatorSub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorSub()
}

jest.mock('../../presentation/controller/signup/signup-protocols')

describe('SignUpValidation Factory ', () => {
  test('should call ValidatorComposite with all Validators', () => {
    makeSignUpValidator()
    const validators: Validator[] = []
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    validators.push(new RequiredFieldValidation(requiredFields))
    validators.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    validators.push(new EmailValidation('email', makeEmailValidatorSub()))
    expect(ValidatorComposite).toHaveBeenCalledWith(validators)
  })
})
