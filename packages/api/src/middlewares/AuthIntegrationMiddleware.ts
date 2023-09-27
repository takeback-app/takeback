import { NextFunction, Request, Response } from 'express'
import { IntegrationType } from '@prisma/client'
import { InternalError } from '../config/GenerateErros'
import { prisma } from '../prisma'

export const AuthIntegrationMiddleware = async (
  request: Request,
  _response: Response,
  next: NextFunction,
) => {
  const companyId = request['companyId']

  if (!companyId) {
    throw new InternalError('Não autorizado', 401)
  }

  const company = await prisma.company.findUnique({
    where: { id: companyId },
    select: {
      integrationType: true,
      paymentPlan: { select: { canUseIntegration: true } },
      integrationSettings: true,
    },
  })

  if (!company || !company.paymentPlan.canUseIntegration) {
    throw new InternalError('Não autorizado', 401)
  }

  if (company.integrationType !== IntegrationType.DESKTOP) {
    throw new InternalError('Integração não compatível', 401)
  }

  if (!company.integrationSettings) {
    throw new InternalError('Integração não configurada', 403)
  }

  if (company.integrationSettings.type !== 'DESKTOP') {
    throw new InternalError(
      'Integração não configurada para esse tipo de aplicação',
      403,
    )
  }

  next()
}
