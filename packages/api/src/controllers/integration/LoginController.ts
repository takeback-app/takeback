import { Request, Response } from 'express'

import bcrypt from 'bcrypt'
import { createHash } from 'node:crypto'

import { prisma } from '../../prisma'
import { InternalError } from '../../config/GenerateErros'

class LoginController {
  async handle(request: Request, response: Response) {
    const { password, cpf } = request.body

    const user = await prisma.companyUser.findUnique({
      where: { cpf },
      include: {
        company: {
          select: {
            paymentPlan: { select: { canUseIntegration: true } },
          },
        },
      },
    })

    if (!user) {
      throw new InternalError('Usuário não encontrado', 401)
    }

    if (!user.isActive) {
      throw new InternalError('Usuário não ativo', 401)
    }

    if (!user.company.paymentPlan.canUseIntegration) {
      throw new InternalError('Plano de pagamento não autorizado', 401)
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      throw new InternalError('Erro ao realizar login', 401)
    }

    const token = await prisma.accessToken.findFirst({
      where: { companyId: user.companyId },
    })

    if (token) {
      return response.status(200).json({ token: token.token })
    }

    const accessToken = await prisma.accessToken.create({
      data: {
        companyId: user.companyId,
        token: createHash('sha256').digest('hex'),
      },
    })

    return response.status(200).json({ token: accessToken.token })
  }
}

export default new LoginController()
