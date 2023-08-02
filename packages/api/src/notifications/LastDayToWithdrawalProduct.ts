import { NotificationType, StoreOrder } from '@prisma/client'
import {
  Notification,
  NotificationRecord,
  UserType,
  Via,
} from './entities/Notification'

export class LastDayToWithdrawalProduct extends Notification {
  constructor(protected storeOrder: StoreOrder, protected companyName: string) {
    super()
  }

  public toRecord(): NotificationRecord {
    return {
      title: 'Hoje é o último dia para retirar seu pedido',
      body: `Você tem até hoje para retirar sua compra no(a) ${this.companyName} e não perder. Corra que ainda dá tempo. Acesse o app para saber mais.`,
      data: { id: this.storeOrder.id },
    }
  }

  public getType(): NotificationType {
    return NotificationType.RAFFLE_WINNER
  }

  public getUserType(): UserType {
    return UserType.CONSUMER
  }

  public via(): Via[] {
    return [Via.DATABASE, Via.EXPO]
  }
}
