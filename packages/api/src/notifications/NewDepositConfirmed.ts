import { Deposit, NotificationType } from '@prisma/client'
import {
  Notification,
  NotificationRecord,
  UserType,
  Via,
} from './entities/Notification'
import { currency } from '../utils/Masks'

export class NewDepositConfirmed extends Notification {
  constructor(protected deposit: Deposit) {
    super()
  }

  public toRecord(): NotificationRecord {
    const money = currency(+this.deposit.value)

    return {
      title: 'Transferência realizada',
      body: `Crédito de ${money} reais realizado em seu saldo takeback.`,
      data: { id: this.deposit.id },
    }
  }

  public getType(): NotificationType {
    return NotificationType.NEW_DEPOSIT_CONFIRMED
  }

  public getUserType(): UserType {
    return UserType.CONSUMER
  }

  public via(): Via[] {
    return [Via.DATABASE, Via.EXPO]
  }
}
