import { getRepository } from "typeorm";
import { Settings } from "../../../database/models/Settings";

class FindPaymentInfoUseCase {
  async execute() {
    const settings = await getRepository(Settings).findOne({
      select: ["takebackPixKey", "takebackQRCode"],
      where: { id: 1 },
    });

    return { pixKey: settings.takebackPixKey, qrCode: settings.takebackQRCode };
  }
}

export { FindPaymentInfoUseCase };
