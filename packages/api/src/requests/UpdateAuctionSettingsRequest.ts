import { z } from 'zod'
import { money } from './rules/money'

export const UpdateAuctionSettingsRequest = z
  .object({
    isEnabled: z.boolean(),
    defaultDurationHours: z
      .number()
      .int('O prazo padrão deve ser um número inteiro de horas')
      .min(1, 'O prazo padrão deve ser de pelo menos 1 hora')
      .max(720, 'O prazo padrão deve ser de no máximo 720 horas'),
    listingFee: money('A taxa de anúncio').refine(
      (value) => value >= 0,
      'A taxa de anúncio não pode ser negativa',
    ),
    minimumStartingBid: money('O lance inicial mínimo').refine(
      (value) => value > 0,
      'O lance inicial mínimo deve ser maior que zero',
    ),
    defaultMinimumIncrement: money('O incremento padrão').refine(
      (value) => value > 0,
      'O incremento padrão deve ser maior que zero',
    ),
  })
  .strict()
