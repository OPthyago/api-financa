import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { SignUpController } from '../../presentation/controller/signup/signup'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { AccountPrismaRepository } from '../../infra/db/psql/repository/account-repository/account'

export const makeSignUpController = (): SignUpController => {
  const salt = 12
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountPrismaRepository = new AccountPrismaRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountPrismaRepository)
  return new SignUpController(emailValidatorAdapter, dbAddAccount)
}
