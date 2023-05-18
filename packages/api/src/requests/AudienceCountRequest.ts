import { NotificationSolicitationSex, StoreVisitType } from "@prisma/client";
import { z } from "zod";

export const AudienceCountRequest = z
  .object({
    audienceSex: z.nativeEnum(NotificationSolicitationSex),
    minAudienceAge: z.number().positive().int().optional(),
    maxAudienceAge: z.number().positive().int().optional(),
    audienceBalance: z.number().optional(),
    storeVisitType: z.nativeEnum(StoreVisitType),
    dateOfPurchase: z.string().datetime().optional(),
    hasChildren: z.boolean().optional(),
  })
  .strict()
  .refine(
    ({ storeVisitType, dateOfPurchase }) => {
      if (storeVisitType !== "FROM_THE_DATE_OF_PURCHASE") return true;

      return !!dateOfPurchase;
    },
    { path: ["dateOfPurchase"], message: "Campo obrigatório" }
  )
  .refine(
    ({ dateOfPurchase }) => {
      if (!dateOfPurchase) return true;

      return new Date(dateOfPurchase).getTime() <= new Date().getTime();
    },
    { path: ["dateOfPurchase"], message: "Data futura não é permitida" }
  );
