import { z } from 'zod'

const hasAtMostTwoDecimals = (value: number) =>
  Math.abs(value * 100 - Math.round(value * 100)) < 1e-6

const money = (label: string) =>
  z
    .number({ invalid_type_error: `${label} deve ser um número` })
    .max(1_000_000, `${label} deve ser no máximo R$ 1.000.000,00`)
    .refine(
      hasAtMostTwoDecimals,
      `${label} deve ter no máximo 2 casas decimais`,
    )

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
