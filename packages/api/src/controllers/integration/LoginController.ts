import { Request, Response } from 'express'

import bcrypt from 'bcrypt'
import { IntegrationType } from '@prisma/client'
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
            integrationType: true,
            paymentPlan: { select: { canUseIntegration: true } },
            integrationSettings: true,
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

    if (user.company.integrationType !== IntegrationType.DESKTOP) {
      throw new InternalError('Integração não compatível', 401)
    }

    if (!user.company.paymentPlan.canUseIntegration) {
      throw new InternalError('Plano de pagamento não autorizado', 401)
    }

    if (!user.company.integrationSettings) {
      throw new InternalError('Integração não configurada', 403)
    }

    if (user.company.integrationSettings.type !== 'DESKTOP') {
      throw new InternalError(
        'Integração não configurada para esse tipo de aplicação',
        403,
      )
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
        token: createHash('sha256').update(user.companyId).digest('hex'),
      },
    })

    return response.status(200).json({ token: accessToken.token })
  }
}

export default new LoginController()
