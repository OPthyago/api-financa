import { PrismaHelper as sut } from './prisma-helper'

describe('Prisma Helper', () => {
  test('should always return an PrismaClient', async () => {
    const accountData = await sut.connect()
    expect(accountData).toBeTruthy()
    await sut.disconnect()
    expect(sut.client).toBeNull()
    await sut.connect()
    expect(sut.client).toBeTruthy()
  })

  test('should return a correct value when calls map method', async () => {
    const fakeAccount = {
      name: 'valid_name',
      email: 'valid_name',
      password: 'valid_name'
    }
    const mapAccount = await sut.map(fakeAccount)
    expect(mapAccount).toEqual({
      data: fakeAccount
    })
  })
})
