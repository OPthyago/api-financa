import { Validator } from '../../protocols/validator'

export class ValidatorComposite implements Validator {
  private readonly validators: Validator[]

  constructor (validators: Validator[]) {
    this.validators = validators
  }

  validate (input: any): Error | null {
    for (const validator of this.validators) {
      const validatorError = validator.validate(input)
      if (validatorError) {
        return validatorError
      }
    }
    return null
  }
}
