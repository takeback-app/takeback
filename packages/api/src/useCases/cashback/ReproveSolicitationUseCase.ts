import { prisma } from "../../prisma";

interface ReproveSolicitationDTO {
  solicitationId: string;
  companyUserId: string;
  reason: string;
}

export class ReproveSolicitationUseCase {
  async execute({
    companyUserId,
    reason,
    solicitationId,
  }: ReproveSolicitationDTO) {
    await prisma.transactionSolicitation.update({
      where: { id: solicitationId },
      data: {
        status: "CANCELED",
        updatedAt: new Date(),
        companyUserId,
        text: reason,
      },
    });
  }
}
