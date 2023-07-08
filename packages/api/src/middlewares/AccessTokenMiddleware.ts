import { Request, Response, NextFunction } from 'express'
import { prisma } from '../prisma'

export const AccessTokenMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = request.headers.authorization

    if (!authHeader) {
      return response.status(498).json({ message: 'Token não informado' })
    }

    const parts = authHeader.split(' ')

    if (parts.length !== 2) {
      return response.status(498).json({ message: 'Erro no token' })
    }

    const [schema, token] = parts

    if (!/^Bearer$/i.test(schema)) {
      return response.status(498).json({ message: 'Token mau formado' })
    }

    const accessToken = await prisma.accessToken.findFirst({
      where: { token },
    })

    if (!accessToken) {
      return response.status(401).json({ message: 'Sem permissão' })
    }

    request['companyId'] = accessToken.companyId

    next()
  } catch (error) {
    console.log(error)

    response.status(498).json({ message: 'Não autorizado' })
  }
}
