import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { PaymentOrderMethods } from "../../../database/models/PaymentOrderMethods";
import { Settings } from "../../../database/models/Settings";

class FindaPaymentMethodUseCase {
  async execute() {
    const methods = await getRepository(PaymentOrderMethods)
      .createQueryBuilder("methods")
      .select(["methods.id", "methods.description"])
      .where("methods.isActive = :isActive", { isActive: true })
      .getRawMany();

    const settings = await getRepository(Settings).findOne({
      select: ["takebackPixKey", "takebackQRCode"],
      where: { id: 1 },
    });

    if (methods.length === 0) {
      throw new InternalError("Não há métodos cadastrados", 404);
    }

    const pixSettings = {
      takebackPixKey: settings.takebackPixKey,
      qrcodeKey: settings.takebackQRCode,
    };

    return { methods, pixSettings };
  }
}

export { FindaPaymentMethodUseCase };
