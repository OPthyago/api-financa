import { ValidatorComposite } from '../../presentation/controller/signup/signup-protocols'
import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation'
import { Validator } from '../../presentation/helpers/validators/validator'

export const makeSignUpValidator = (): ValidatorComposite => {
  const validators: Validator[] = []
  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
  validators.push(new RequiredFieldValidation(requiredFields))
  return new ValidatorComposite(validators)
}
