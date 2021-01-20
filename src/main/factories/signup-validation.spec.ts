import { ValidatorComposite } from '../../presentation/controller/signup/signup-protocols'
import { CompareFieldsValidation } from '../../presentation/helpers/validators/compare-fields-validation'
import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation'
import { Validator } from '../../presentation/helpers/validators/validator'
import { makeSignUpValidator } from './signup-validator'

jest.mock('../../presentation/controller/signup/signup-protocols')

describe('SignUpValidation Factory ', () => {
  test('should call ValidatorComposite with all Validators', () => {
    makeSignUpValidator()
    const validators: Validator[] = []
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    validators.push(new RequiredFieldValidation(requiredFields))
    validators.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    expect(ValidatorComposite).toHaveBeenCalledWith(validators)
  })
})
