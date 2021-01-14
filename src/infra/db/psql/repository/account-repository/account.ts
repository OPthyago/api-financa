import { AddAccountRepository } from '../../../../../data/protocols/add-addcount-repository'
import { AccountModel } from '../../../../../domain/models/account'
import { AddAccountModel } from '../../../../../domain/usecases/add-account'
import { PrismaHelper } from '../../helpers/prisma-helper'

export class AccountRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const prismaClient = await PrismaHelper.connect()
    return await prismaClient.account.create(await PrismaHelper.map(accountData))
  }
}
