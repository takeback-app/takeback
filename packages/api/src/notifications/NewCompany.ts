import { NotificationType } from "@prisma/client";
import {
  Notification,
  NotificationRecord,
  UserType,
  Via,
} from "./entities/Notification";

interface Company {
  id: string;
  fantasyName: string;
}

export class NewCompany extends Notification {
  constructor(protected company: Company) {
    super();
  }

  public toRecord(): NotificationRecord {
    return {
      title: "Nova Empresa Parceira 🤝",
      body: `${this.company.fantasyName} é uma nova empresa parceira na sua cidade. 🤩`,
      data: { id: this.company.id },
    };
  }

  public getType(): NotificationType {
    return NotificationType.NEW_COMPANY;
  }

  public getUserType(): UserType {
    return UserType.CONSUMER;
  }

  public via(): Via[] {
    return [Via.DATABASE, Via.EXPO];
  }
}
