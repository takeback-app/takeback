import { NotificationType } from '@prisma/client'
import {
  Notification,
  NotificationRecord,
  UserType,
  Via,
} from './entities/Notification'

export class NewStoreProduct extends Notification {
  constructor(protected storeProductId: string, protected companyName: string) {
    super()
  }

  public toRecord(): NotificationRecord {
    return {
      title: 'Nova oferta na sua cidade 🤩',
      body: `${this.companyName} tem uma oferta para você. Não fique de fora! Acesse o app para saber mais.`,
      data: { id: this.storeProductId },
    }
  }

  public getType(): NotificationType {
    return NotificationType.NEW_STORE_PRODUCT
  }

  public getUserType(): UserType {
    return UserType.CONSUMER
  }

  public via(): Via[] {
    return [Via.DATABASE, Via.EXPO]
  }
}
