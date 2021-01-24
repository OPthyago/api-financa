import { MissingParamError } from '../../error'
import { Validator } from '../../protocols/validator'

export class RequiredFieldValidation implements Validator {
  private readonly fields: string[]

  constructor (fields: string[]) {
    this.fields = fields
  }

  validate (input: any): Error | null {
    for (const field of this.fields) {
      if (!input[field]) {
        return new MissingParamError(field)
      }
    }
    return null
  }
}
