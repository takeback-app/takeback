import { NotificationType } from "@prisma/client";
import {
  Notification,
  NotificationRecord,
  UserType,
  Via,
} from "./entities/Notification";

export class NewRaffleToApprove extends Notification {
  constructor(protected raffleId: string, protected companyName: string) {
    super();
  }

  public toRecord(): NotificationRecord {
    return {
      title: "Novo sorteio Cadastrado",
      body: `Sorteio gerado para ${this.companyName}`,
      subject: `TakeBack - Novo sorteio Cadastrado`,
      data: { id: this.raffleId },
    };
  }

  public getType(): NotificationType {
    return NotificationType.NEW_RAFFLE_TO_APPROVE;
  }

  public getUserType(): UserType {
    return UserType.TAKEBACK_USER;
  }

  public via(): Via[] {
    return [Via.DATABASE, Via.EMAIL];
  }
}
