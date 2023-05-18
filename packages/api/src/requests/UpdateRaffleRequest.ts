import { z } from "zod";
import { ItemSchema } from "./CreateRaffleRequest";

export const UpdateRaffleRequest = z
  .object({
    title: z.string().optional(),
    imageUrl: z.string().url().optional(),
    pickUpLocation: z.string().optional(),
    ticketValue: z.number().min(0).optional(),
    drawDate: z.string().datetime().optional(),
    isOpenToOtherCompanies: z.boolean().optional(),
    isOpenToEmployees: z.boolean(),
    items: ItemSchema.array().optional(),
  })
  .strict();
