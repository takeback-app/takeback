import { Request, Response } from 'express'
import { DateTime } from 'luxon'
import { prisma } from '../../prisma'
import { db } from '../../knex'
import { Notify } from '../../notifications'
import { BirthdayNotification } from '../../notifications/BirthdayNotification'
import { InternalError } from '../../config/GenerateErros'

export class BirthdayNotificationController {
  async index(request: Request, response: Response) {
    const { companyId } = request['tokenPayload']

    const date = DateTime.now().setZone('America/Sao_Paulo')

    const companyAddress = await prisma.company.findUnique({
      where: { id: companyId },
      select: {
        companyAddress: {
          select: {
            cityId: true,
          },
        },
      },
    })

    const customers = await db
      .select('consumers.id')
      .from('consumers')
      .join('transactions', function () {
        this.on('transactions.consumersId', 'consumers.id').andOnVal(
          'transactions.companiesId',
          companyId,
        )
      })
      .join('consumer_address', 'consumer_address.id', 'consumers.addressId')
      .whereRaw('extract(month from consumers."birthDate") = ?', [date.month])
      .whereRaw('extract(day from consumers."birthDate") = ?', [date.day])
      .where('consumer_address.cityId', companyAddress.companyAddress.cityId)
      .groupBy('consumers.id')

    const nonCustomers = await db
      .select('consumers.id')
      .from('consumers')
      .leftJoin('transactions', function () {
        this.on('transactions.consumersId', 'consumers.id').andOnVal(
          'transactions.companiesId',
          companyId,
        )
      })
      .join('consumer_address', 'consumer_address.id', 'consumers.addressId')
      .whereNull('transactions.id')
      .whereRaw('extract(month from consumers."birthDate") = ?', [date.month])
      .whereRaw('extract(day from consumers."birthDate") = ?', [date.day])
      .where('consumer_address.cityId', companyAddress.companyAddress.cityId)
      .groupBy('consumers.id')

    const plan = await prisma.paymentPlan.findFirst({
      where: { companies: { some: { id: companyId } } },
    })

    const todayBirthdayNotification =
      await prisma.birthdayNotification.findFirst({
        where: {
          companyId,
          createdAt: { gte: date.startOf('day').toJSDate() },
        },
      })

    return response.json({
      numberOfCustomers: customers.length,
      numberOfNonCustomers: nonCustomers.length,
      hasSentToday: !!todayBirthdayNotification,
      hasAccess: plan.canSendBirthdayNotification,
    })
  }

  async store(request: Request, response: Response) {
    const { companyId } = request['tokenPayload']

    const { title, message } = request.body

    const date = DateTime.now().setZone('America/Sao_Paulo')

    const todayBirthdayNotification =
      await prisma.birthdayNotification.findFirst({
        where: {
          companyId,
          createdAt: { gte: date.startOf('day').toJSDate() },
        },
      })

    if (todayBirthdayNotification) {
      throw new InternalError('Já foi enviado uma notificação hoje.', 400)
    }

    const { id } = await prisma.birthdayNotification.create({
      data: { companyId },
    })

    const consumers = await db
      .select('consumers.id', 'consumers.expoNotificationToken')
      .from('consumers')
      .whereRaw('extract(month from consumers."birthDate") = ?', [date.month])
      .whereRaw('extract(day from consumers."birthDate") = ?', [date.day])

    Notify.sendMany(consumers, new BirthdayNotification(id, title, message))

    return response.status(201).json({ message: 'Notificação enviada.' })
  }
}
