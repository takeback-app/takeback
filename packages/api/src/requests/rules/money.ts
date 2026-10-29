import { z } from 'zod'

const hasAtMostTwoDecimals = (value: number) =>
  Math.abs(value * 100 - Math.round(value * 100)) < 1e-6

export const money = (label: string) =>
  z
    .number({
      required_error: `${label} é obrigatório`,
      invalid_type_error: `${label} deve ser um número`,
    })
    .max(1_000_000, `${label} deve ser no máximo R$ 1.000.000,00`)
    .refine(
      hasAtMostTwoDecimals,
      `${label} deve ter no máximo 2 casas decimais`,
    )
