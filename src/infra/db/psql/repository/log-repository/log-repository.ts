import { LogRepository } from '../../../../../data/protocols/log-repository'
import { PrismaHelper } from '../../helpers/prisma-helper'

export class LogPrismaRepository implements LogRepository {
  async logError (stack: string): Promise<void> {
    const prismaClient = await PrismaHelper.connect()
    await prismaClient.account.create(await PrismaHelper.map(stack))
    return new Promise(resolve => resolve())
  }
}
