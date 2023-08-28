/* eslint-disable no-unused-vars */
import { Request, Response } from 'express'
import { DateTime } from 'luxon'
import { prisma } from '../../../prisma'

const PER_PAGE = 25

enum BonusTypes {
  SELL = 'SELL',
  NEW_USER = 'NEW_USER',
  CONSULTANT = 'CONSULTANT',
  REFERRAL = 'REFERRAL',
}

export class BonusController {
  async index(request: Request, response: Response) {
    const { dateEnd, dateStart, bonusType, page } = request.query as Record<
      string,
      string
    >

    const startDate = dateStart
      ? DateTime.fromISO(dateStart).startOf('day').toJSDate()
      : undefined
    const endDate = dateEnd
      ? DateTime.fromISO(dateEnd).endOf('day').toJSDate()
      : undefined

    const bonuses = await prisma.bonus.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        type: bonusType ? BonusTypes[bonusType] : undefined,
      },
      include: {
        consumer: {
          select: {
            fullName: true,
          },
        },
        transaction: {
          select: {
            company: { select: { fantasyName: true } },
            consumer: {
              select: {
                fullName: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: PER_PAGE,
      skip: (Number(page) - 1) * PER_PAGE,
    })

    const totalizer = await prisma.bonus.aggregate({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        type: bonusType ? BonusTypes[bonusType] : undefined,
      },
      _sum: {
        value: true,
      },
    })

    const count = await prisma.bonus.count({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        type: bonusType ? BonusTypes[bonusType] : undefined,
      },
    })

    return response.json({
      data: bonuses,
      totalizer: { totalAmount: +totalizer._sum.value, bonusCount: count },
      meta: { lastPage: Math.ceil(count / PER_PAGE) },
    })
  }

  async show(request: Request, response: Response) {
    const { id } = request.params

    const bonus = await prisma.bonus.findUnique({
      where: { id },
      include: {
        consumer: { select: { fullName: true, cpf: true } },
        transaction: {
          select: {
            company: { select: { id: true, fantasyName: true } },
            companyUser: { select: { name: true, cpf: true } },
            consumer: { select: { fullName: true } },
          },
        },
      },
    })

    return response.json(bonus)
  }
}
