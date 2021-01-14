import { Encrypter } from '../protocols/encryper'
import { DbAddAccount } from './db-add-account'

const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_value'))
    }
  }
  const encrypterStub = new EncrypterStub()
  return encrypterStub
}

interface SutType {
  sut: DbAddAccount
  encrypterStub: Encrypter
}

const makeSut = (): SutType => {
  const encrypterStub = makeEncrypterStub()
  const sut = new DbAddAccount(encrypterStub)
  return {
    sut,
    encrypterStub
  }
}

describe('DbAddAccount Usecase', () => {
  test('should call Encrypter with correct value', async () => {
    const { sut, encrypterStub } = makeSut()
    const encrypterSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.add({
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    })
    expect(encrypterSpy).toHaveBeenCalledWith('valid_password')
  })
})
