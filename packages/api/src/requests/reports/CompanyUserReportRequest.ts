import { z } from "zod";
import { OrderByColumn } from "../../reports/CompanyUsersReport";

export const CompanyUserReportRequest = z
  .object({
    page: z.string().optional().default("1"),
    dateStart: z.string().datetime().optional(),
    dateEnd: z.string().datetime().optional(),
    orderByColumn: z.nativeEnum(OrderByColumn).optional(),
    order: z.enum(["desc", "asc"]).optional(),
    office: z.string().optional(),
    transactionStatus: z.string().optional(),
  })
  .strict();
