import { NotificationType } from "@prisma/client";
import {
  Notification,
  NotificationRecord,
  UserType,
  Via,
} from "./entities/Notification";

export class NewRaffle extends Notification {
  constructor(protected raffleId: string, protected companyName: string) {
    super();
  }

  public toRecord(): NotificationRecord {
    return {
      title: "Novo sorteio na sua cidade 🤩",
      body: `${this.companyName} lançou um novo sorteio. Não fique de fora! Acesse o app para saber mais.`,
      data: { id: this.raffleId },
    };
  }

  public getType(): NotificationType {
    return NotificationType.NEW_RAFFLE;
  }

  public getUserType(): UserType {
    return UserType.CONSUMER;
  }

  public via(): Via[] {
    return [Via.DATABASE, Via.EXPO];
  }
}
