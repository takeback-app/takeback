import { Decimal } from '@prisma/client/runtime/library'
import { GenerateBonus } from './GenerateBonus'

import { prisma } from '../../../prisma'
import { Notify } from '../../../notifications'
import { ReferralBonusNotification } from '../../../notifications/ReferralBonusNotification'

export class GenerateReferralBonus extends GenerateBonus {
  async create(transactionId: number) {
    const transaction = await this.getTransaction(transactionId)

    const consumer = await this.getFatherConsumerFromChildren(
      transaction.consumersId,
    )

    if (!consumer) return

    const referral = consumer.referrals[0]

    if (referral.status == 'APPROVED') {
      await prisma.referral.update({
        where: { id: referral.id },
        data: { status: 'BONUSING' },
      })
    }

    const referralBonus = await this.getValidBonusCalculator()

    if (!referralBonus) return

    const baseValue = +transaction.takebackFeeAmount * referralBonus

    if (new Decimal(baseValue).lessThan(0.01)) return

    const value = +baseValue.toFixed(2)

    const bonus = await prisma.bonus.create({
      data: {
        consumerId: consumer.id,
        type: 'REFERRAL',
        value,
        transactionId: transaction.id,
      },
    })

    await this.updateConsumerBalance(consumer, bonus)

    await this.updateBalanceExpireDate.execute(consumer.id)

    Notify.send(consumer.id, new ReferralBonusNotification(bonus))

    return bonus
  }

  async getValidBonusCalculator() {
    const settings = await prisma.setting.findFirst()

    return settings.referralBonusPercentage.toNumber()
  }

  getFatherConsumerFromChildren(consumerId: string) {
    return prisma.consumer.findFirst({
      where: {
        referrals: {
          some: {
            childrenConsumerId: consumerId,
            status: { not: 'WAITING' },
          },
        },
      },
      include: {
        referrals: { where: { childrenConsumerId: consumerId } },
      },
    })
  }
}
