import { NotificationType, RaffleItem } from "@prisma/client";
import {
  Notification,
  NotificationRecord,
  UserType,
  Via,
} from "./entities/Notification";

export class WinnerRaffle extends Notification {
  constructor(protected raffleItem: RaffleItem, protected companyName: string) {
    super();
  }

  public toRecord(): NotificationRecord {
    return {
      title: "Parabéns, você ganhou um sorteio 🎉",
      body: `Você ganhou um ${this.raffleItem.description} na empresa ${this.companyName}. Acesse o app para saber mais.`,
      data: { id: this.raffleItem.id },
    };
  }

  public getType(): NotificationType {
    return NotificationType.RAFFLE_WINNER;
  }

  public getUserType(): UserType {
    return UserType.CONSUMER;
  }

  public via(): Via[] {
    return [Via.DATABASE, Via.EXPO];
  }
}
