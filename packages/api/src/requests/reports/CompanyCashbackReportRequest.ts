import { z } from "zod";
import { OrderByColumn } from "../../reports/CompanyCashbacksReport";

export const CompanyCashbackReportRequest = z
  .object({
    page: z.string().optional().default("1"),
    dateStart: z.string().datetime().optional(),
    dateEnd: z.string().datetime().optional(),
    orderByColumn: z.nativeEnum(OrderByColumn).optional(),
    order: z.enum(["desc", "asc"]).optional().default("desc"),
    cashbackStatus: z.string().optional(),
    paymentMethodType: z.string().optional(),
  })
  .strict();
