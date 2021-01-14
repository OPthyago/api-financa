import { PrismaClient } from '@prisma/client'

export const PrismaHelper = {
  client: null as unknown as PrismaClient,

  async connect (): Promise<PrismaClient> {
    if (!this.client) {
      this.client = new PrismaClient()
    }
    return this.client
  },

  async disconnect (): Promise<void> {
    this.client.$disconnect()
    this.client = null
  },

  async map (obj: any): Promise<any> {
    return Object.assign({}, {}, { data: obj })
  }
}
