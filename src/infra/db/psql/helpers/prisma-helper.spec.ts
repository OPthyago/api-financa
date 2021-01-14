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
})
