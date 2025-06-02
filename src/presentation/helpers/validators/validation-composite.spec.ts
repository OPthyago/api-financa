import { MissingParamError } from '../../error'
import { Validator } from '../../protocols/validator'
import { ValidatorComposite } from './validation-composite'

// Renamed for clarity
const makeValidatorStub = (): Validator => {
  class ValidatorStub implements Validator {
    validate (input: any): Error | null {
      return null // Default success
    }
  }
  return new ValidatorStub()
}

interface SutTypes {
  sut: ValidatorComposite
  validatorStubs: Validator[]
}

// Allow passing custom stubs for more control
const makeSut = (customValidators?: Validator[]): SutTypes => {
  const validatorStubs = customValidators || [makeValidatorStub(), makeValidatorStub()]
  const sut = new ValidatorComposite(validatorStubs)
  return {
    sut,
    validatorStubs
  }
}

describe('ValidationComposite', () => { // Consistent naming with class
  test('Should return an error if any validator fails', () => {
    const { sut, validatorStubs } = makeSut()
    // Make the second validator fail to ensure iteration
    jest.spyOn(validatorStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Should return the first error if more than one validator fails', () => {
    const { sut, validatorStubs } = makeSut()
    jest.spyOn(validatorStubs[0], 'validate').mockReturnValueOnce(new Error('FirstError')) // Specific error
    jest.spyOn(validatorStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new Error('FirstError'))
  })

  test('Should not call subsequent validators if one fails', () => {
    const { sut, validatorStubs } = makeSut()
    const validateSpy0 = jest.spyOn(validatorStubs[0], 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const validateSpy1 = jest.spyOn(validatorStubs[1], 'validate')

    sut.validate({ field: 'any_value' })

    expect(validateSpy0).toHaveBeenCalled()
    expect(validateSpy1).not.toHaveBeenCalled()
  })

  test('Should call all validators if all succeed', () => {
    const validatorStub1 = makeValidatorStub()
    const validatorStub2 = makeValidatorStub()
    const validatorStubs = [validatorStub1, validatorStub2]
    const sut = new ValidatorComposite(validatorStubs)

    const validateSpy1 = jest.spyOn(validatorStub1, 'validate')
    const validateSpy2 = jest.spyOn(validatorStub2, 'validate')

    const input = { field: 'any_value' }
    sut.validate(input)

    expect(validateSpy1).toHaveBeenCalledWith(input)
    expect(validateSpy2).toHaveBeenCalledWith(input)
  })
  
  test('Should return null if all validators succeed', () => { // Renamed for clarity
    const { sut } = makeSut() // Default stubs all succeed
    const error = sut.validate({ field: 'any_value' })
    expect(error).toBeNull() // Stricter check than toBeFalsy
  })

  test('Should handle being constructed with an empty array of validators', () => {
    const sut = new ValidatorComposite([])
    const error = sut.validate({ field: 'any_value' })
    expect(error).toBeNull()
  })
})
