import { z } from 'zod'

export const ItemSchema = z
  .object({
    description: z.string(),
    order: z.number().int().min(1),
    imageUrl: z.string().url(),
  })
  .strict()

export const CreateRaffleRequest = z
  .object({
    title: z.string(),
    imageUrl: z.string().url().optional(),
    ticketValue: z.number().min(0),
    drawDate: z.string().datetime(),
    pickUpLocation: z.string(),
    isOpenToOtherCompanies: z.boolean(),
    openToOtherCompanies: z.string().array().optional(),
    isOpenToEmployees: z.boolean(),
    items: ItemSchema.array(),
  })
  .strict()
