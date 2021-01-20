import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountPrismaRepository } from '../../infra/db/psql/repository/account-repository/account'
import { LogPrismaRepository } from '../../infra/db/psql/repository/log-repository/log-repository'
import { SignUpController } from '../../presentation/controller/signup/signup'
import { Controller } from '../../presentation/protocols'
import { LogControllerDecorator } from '../decorators/log'
import { makeSignUpValidator } from './signup-validator'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountPrismaRepository = new AccountPrismaRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountPrismaRepository)
  const logRepository = new LogPrismaRepository()
  const signUpController = new SignUpController(dbAddAccount, makeSignUpValidator())
  return new LogControllerDecorator(signUpController, logRepository)
}
