import { Request, Response } from "express";
import { prisma } from "../../../prisma";
import { Prisma } from "@prisma/client";

export class TicketController {
  async index(request: Request, response: Response) {
    const { id: consumerId } = request["tokenPayload"];
    let { page, limit } = request.query;

    const pageNum = Number(page);
    const limitNum = Number(limit);

    const rawQuery = Prisma.sql([
      `
	    select
				r.title as "raffleTitle",
				c."fantasyName" as "companyName",
				t."totalAmount" as "purchaseAmount",
				MAX(rt."createdAt") as date,
				COUNT(rt.id)::INTEGER as "ticketCount",
				MAX(rt.status) as status
			from raffle_tickets rt
			inner join raffles r ON  r.id = rt."raffleId"
			inner join transactions t on t.id = rt."transactionId"
			inner join companies c on c.id = t."companiesId"
			where rt."consumerId" = '${consumerId}'
			group by t.id, r.id, c.id
			order by t.id DESC
			limit ${limitNum}
			offset ${Math.max(pageNum - 1, 0) * limitNum}
		`,
    ]);

    const tickets = await prisma.$queryRaw<any[]>(rawQuery);

    return response.json(tickets);
  }

  async pendingCount(request: Request, response: Response) {
    const { id: consumerId } = request["tokenPayload"];

    const count = await prisma.raffleTicket.count({
      where: { consumerId, status: "PENDING" },
    });

    return response.json({ count });
  }
}
