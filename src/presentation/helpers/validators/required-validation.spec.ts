import { MissingParamError } from '../../error'
import { RequiredFieldValidation } from './required-field-validation'

const makeSut = (): RequiredFieldValidation => {
  const sut = new RequiredFieldValidation(['field'])
  return sut
}

describe('RequiredFieldValidation', () => {
  test('should return MissingParamError if required field is missing ', () => {
    const sut = makeSut()
    const error = sut.validate({ fieldToCompare: 'any_fields' })
    expect(error).toEqual(new MissingParamError('field'))
  })
})
