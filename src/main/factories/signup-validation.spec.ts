import { ValidatorComposite } from '../../presentation/controller/signup/signup-protocols'
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
    expect(ValidatorComposite).toHaveBeenCalledWith(validators)
  })
})
