import { InvalidParamError } from '../../error'
import { CompareFieldsValidation } from './compare-fields-validation'

const makeSut = (): CompareFieldsValidation => {
  const sut = new CompareFieldsValidation('field', 'fieldToCompare')
  return sut
}

describe('CompareFieldsValidation', () => {
  test('should return InvalidParamError if params are not equal ', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'any_field', fieldToCompare: 'any_fields' })
    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })
})
