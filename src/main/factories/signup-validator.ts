import { ValidatorComposite } from '../../presentation/controller/signup/signup-protocols'
import { CompareFieldsValidation } from '../../presentation/helpers/validators/compare-fields-validation'
import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation'
import { Validator } from '../../presentation/helpers/validators/validator'

export const makeSignUpValidator = (): ValidatorComposite => {
  const validators: Validator[] = []
  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
  validators.push(new RequiredFieldValidation(requiredFields))
  validators.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
  return new ValidatorComposite(validators)
}
