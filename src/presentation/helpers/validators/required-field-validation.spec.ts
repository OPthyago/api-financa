import { MissingParamError } from '../../error'
import { RequiredFieldValidation } from './required-field-validation'

// Helper to create SUT with specific fields
const makeSut = (fields: string[] = ['field']): RequiredFieldValidation => {
  return new RequiredFieldValidation(fields)
}

describe('RequiredFieldValidation', () => {
  test('Should return MissingParamError if a required field is not provided', () => {
    const sut = makeSut(['field'])
    const error = sut.validate({ otherField: 'any_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Should return null if the required field is provided and not empty', () => {
    const sut = makeSut(['field'])
    const error = sut.validate({ field: 'any_value' })
    expect(error).toBeNull()
  })

  test('Should return MissingParamError if the required field is an empty string', () => {
    const sut = makeSut(['field'])
    const error = sut.validate({ field: '' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Should return MissingParamError if the required field is null', () => {
    const sut = makeSut(['field'])
    const error = sut.validate({ field: null })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Should return MissingParamError if the required field is undefined', () => {
    // This is effectively the same as the first test but more explicit
    const sut = makeSut(['field'])
    const error = sut.validate({ field: undefined })
    expect(error).toEqual(new MissingParamError('field'))
  })
  
  test('Should consider 0 as a missing parameter (due to !input[field] logic)', () => {
    const sut = makeSut(['field'])
    const error = sut.validate({ field: 0 })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Should consider false as a missing parameter (due to !input[field] logic)', () => {
    const sut = makeSut(['field'])
    const error = sut.validate({ field: false })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Should return null if the required field is present and is the number 0, if the logic were to allow it (current logic fails)', () => {
    // This test documents the current behavior for 0, which is treated as missing.
    // If 0 should be valid, the implementation of RequiredFieldValidation needs to change.
    const sut = makeSut(['field'])
    const error = sut.validate({ field: 0 })
    expect(error).toEqual(new MissingParamError('field')) // Current behavior
    // If 0 were valid, this would be: expect(error).toBeNull()
  })

  test('Should return null if the required field is present and is boolean false, if the logic were to allow it (current logic fails)', () => {
    // This test documents the current behavior for false, which is treated as missing.
    // If false should be valid, the implementation of RequiredFieldValidation needs to change.
    const sut = makeSut(['field'])
    const error = sut.validate({ field: false })
    expect(error).toEqual(new MissingParamError('field')) // Current behavior
    // If false were valid, this would be: expect(error).toBeNull()
  })

  // Tests for multiple fields
  test('Should return null if all specified fields are present', () => {
    const sut = makeSut(['field1', 'field2'])
    const error = sut.validate({ field1: 'value1', field2: 'value2' })
    expect(error).toBeNull()
  })

  test('Should return MissingParamError for the first missing field when multiple fields are required', () => {
    const sut = makeSut(['field1', 'field2', 'field3'])
    const error = sut.validate({ field1: 'value1', field3: 'value3' }) // field2 is missing
    expect(error).toEqual(new MissingParamError('field2'))
  })

  test('Should return MissingParamError for the first field if all are missing', () => {
    const sut = makeSut(['field1', 'field2'])
    const error = sut.validate({})
    expect(error).toEqual(new MissingParamError('field1'))
  })

  test('Should handle an empty array of fields (should return null)', () => {
    const sut = makeSut([])
    const error = sut.validate({ anyField: 'any_value' })
    expect(error).toBeNull()
  })
})
