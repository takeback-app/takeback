import bcrypt from 'bcrypt'
import { isCPF } from 'brazilian-values'
import crypto from 'node:crypto'
import { InternalError } from '../../config/GenerateErros'
import { prisma } from '../../prisma'

export class PlaceholderConsumer {
  public static async create(cpf: string, companyId: string) {
    if (!isCPF(cpf)) throw new InternalError('CPF inválido', 400)

    const consumerId = crypto.randomInt(0, 1000000).toString().padStart(6, '0')

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: {
        companyAddress: {
          select: {
            cityId: true,
          },
        },
      },
    })

    return prisma.consumer.create({
      data: {
        isPlaceholderConsumer: true,
        cpf,
        email: `${consumerId}@takeback.com.br`,
        fullName: `Novo Cliente`,
        password: await bcrypt.hash(consumerId, 10),
        consumerAddress: {
          create: {
            cityId: company.companyAddress.cityId,
          },
        },
      },
    })
  }
}
