import { Request, Response } from "express";
import { GetExtractUseCase } from "../../../useCases/extract/GetExtractUseCase";
import { prisma } from "../../../prisma";
import { GetFirstExtractRegisterUseCase } from "../../../useCases/extract/GetFirstExtractRegisterUseCase";

export class ExtractController {
  async index(request: Request, response: Response) {
    const { id: consumerId } = request["tokenPayload"];

    const useCase = new GetExtractUseCase(consumerId);

    const data = await useCase.execute();

    return response.json(data);
  }

  async paginated(request: Request, response: Response) {
    const { page } = request.query;

    const { id: consumerId } = request["tokenPayload"];

    const pageNumber = Number(page) || 1;

    const getFirstExtractRegisterUseCase = new GetFirstExtractRegisterUseCase(
      consumerId,
      pageNumber
    );

    const shouldLoadMore = await getFirstExtractRegisterUseCase.execute();

    if (!shouldLoadMore) return response.json({ title: undefined, data: [] });

    const useCase = new GetExtractUseCase(consumerId, pageNumber);

    const data = await useCase.execute();
    const monthName = useCase.getMonthName();

    return response.json({
      title: monthName,
      data,
    });
  }

  async showTransaction(request: Request, response: Response) {
    const { id } = request.params;

    const transaction = await prisma.transaction.findUnique({
      where: { id: Number(id) },
      include: {
        company: { select: { fantasyName: true } },
        transactionStatus: { select: { id: true, description: true } },
        transactionPaymentMethods: {
          select: {
            id: true,
            cashbackPercentage: true,
            cashbackValue: true,
            companyPaymentMethod: {
              select: { paymentMethod: { select: { description: true } } },
            },
          },
        },
      },
    });

    return response.json(transaction);
  }

  async showTransfer(request: Request, response: Response) {
    const { id: consumerId } = request["tokenPayload"];
    const { id } = request.params;

    const transfer = await prisma.transfer.findUnique({
      where: { id: Number(id) },
      select: {
        value: true,
        createdAt: true,
        consumerReceivedId: true,
        senderConsumer: { select: { fullName: true } },
        receiverConsumer: { select: { fullName: true } },
      },
    });

    return response.json({
      isReceived: transfer.consumerReceivedId === consumerId,
      consumerName:
        transfer.consumerReceivedId === consumerId
          ? transfer.senderConsumer.fullName
          : transfer.receiverConsumer.fullName,
      createdAt: transfer.createdAt,
      value: +transfer.value,
    });
  }
}
