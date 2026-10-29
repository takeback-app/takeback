import { Bonus, NotificationType } from "@prisma/client";
import {
  Notification,
  NotificationRecord,
  UserType,
  Via,
} from "./entities/Notification";
import { currency } from "../utils/Masks";

export class NewUserBonusNotification extends Notification {
  constructor(protected bonus: Bonus) {
    super();
  }

  public toRecord(): NotificationRecord {
    const money = currency(+this.bonus.value);

    return {
      title: "Bônus Novo Cliente 💰",
      body: `Você ganhou ${money} de bônus porque um cliente cadastrado por você criou a conta no TakeBack!`,
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
