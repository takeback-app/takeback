import { Bonus, NotificationType } from "@prisma/client";
import {
  Notification,
  NotificationRecord,
  UserType,
  Via,
} from "./entities/Notification";
import { currency } from "../utils/Masks";

export class ReferralBonusNotification extends Notification {
  constructor(protected bonus: Bonus) {
    super();
  }

  public toRecord(): NotificationRecord {
    const money = currency(+this.bonus.value);

    return {
      title: "Bônus Indicação 💰",
      body: `Você ganhou ${money} referente uma compra feita por um amigo seu!`,
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
