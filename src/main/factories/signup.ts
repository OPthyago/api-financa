import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { SignUpController } from '../../presentation/controller/signup/signup'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { AccountPrismaRepository } from '../../infra/db/psql/repository/account-repository/account'
import { LogControllerDecorator } from '../decorators/log'
import { LogPrismaRepository } from '../../infra/db/psql/repository/log-repository/log-repository'
import { Controller } from '../../presentation/protocols'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountPrismaRepository = new AccountPrismaRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountPrismaRepository)
  const logRepository = new LogPrismaRepository()
  const signUpController = new SignUpController(emailValidatorAdapter, dbAddAccount)
  return new LogControllerDecorator(signUpController, logRepository)
}
