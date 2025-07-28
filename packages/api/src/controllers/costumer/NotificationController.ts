import { Request, Response } from 'express'
import { prisma } from '../../prisma'
import { Cache } from '../../redis'
import { notificationCountKey } from '../../services/cacheKeys'

export class NotificationController {
  async index(request: Request, response: Response) {
    const { id: consumerId } = request['tokenPayload']
    const { page = 1, limit = 10 } = request.query

    const pageIndex = Number(page) - 1
    const take = Number(limit)

    const notifications = await prisma.notification.findMany({
      where: { consumerId },
      orderBy: { createdAt: 'desc' },
      take: take,
      skip: take * pageIndex,
    })

    const unreadNotificationsId = notifications
      .filter((n) => !n.readAt)
      .map((n) => n.id)

    await prisma.notification.deleteMany({
      where: {
        id: { notIn: notifications.map((n) => n.id) },
        consumerId: consumerId,
      },
    })

    if (!unreadNotificationsId.length) {
      return response.json(notifications)
    }

    await prisma.notification.updateMany({
      where: { id: { in: unreadNotificationsId } },
      data: { readAt: new Date() },
    })

    await Cache.forget(notificationCountKey(consumerId))

    return response.json(notifications)
  }

  async unreadNotificationCount(request: Request, response: Response) {
    const { id: consumerId } = request['tokenPayload']

    const cacheKey = notificationCountKey(consumerId)

    const count = await Cache.rememberForever<number>(cacheKey, async () => {
      return prisma.notification.count({
        where: { consumerId, readAt: null },
      })
    })

    return response.json({ count })
  }
}
