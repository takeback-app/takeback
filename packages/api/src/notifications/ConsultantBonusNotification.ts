import { Bonus, NotificationType } from "@prisma/client";
import {
  Notification,
  NotificationRecord,
  UserType,
  Via,
} from "./entities/Notification";
import { currency } from "../utils/Masks";

export class ConsultantBonusNotification extends Notification {
  constructor(protected bonus: Bonus) {
    super();
  }

  public toRecord(): NotificationRecord {
    const money = currency(+this.bonus.value);

    return {
      title: "Bonus Consultor 💰",
      body: `Você ganhou ${money} de bônus e o valor já está disponível no seu saldo. `,
      data: { bonusId: this.bonus.id },
    };
  }

  public getType(): NotificationType {
    return NotificationType.BONUS;
  }

  public getUserType(): UserType {
    return UserType.CONSUMER;
  }

  public via(): Via[] {
    return [Via.DATABASE, Via.EXPO];
  }
}
