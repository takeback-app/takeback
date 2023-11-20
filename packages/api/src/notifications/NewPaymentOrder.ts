import { NotificationType, PaymentOrder } from '@prisma/client'
import {
  Notification,
  NotificationRecord,
  UserType,
  Via,
} from './entities/Notification'

export class NewPaymentOrder extends Notification {
  constructor(
    protected paymentOrder: PaymentOrder,
    protected companyName: string,
  ) {
    super()
  }

  public toRecord(): NotificationRecord {
    return {
      title: 'Novo pedido de pagamento',
      body: `Pedido de pagamento de ${this.paymentOrder.value} gerado para ${this.companyName}`,
      subject: `TakeBack - Novo pedido de pagamento`,
      data: { paymentOrderId: this.paymentOrder.id },
    }
  }

  public getType(): NotificationType {
    return NotificationType.NEW_PAYMENT_ORDER
  }

  public getUserType(): UserType {
    return UserType.TAKEBACK_USER
  }

  public via(): Via[] {
    return [Via.DATABASE, Via.EMAIL]
  }
}
