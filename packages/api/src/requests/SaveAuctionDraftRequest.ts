import { z } from 'zod'
import { money } from './rules/money'
import { AUCTION_IMAGE_MAX_COUNT } from '../useCases/auction/AuctionImages'

export const SaveAuctionDraftRequest = z
  .object({
    title: z
      .string({ required_error: 'Informe o título' })
      .trim()
      .min(3, 'O título deve ter pelo menos 3 caracteres')
      .max(80, 'O título deve ter no máximo 80 caracteres'),
    description: z
      .string({ required_error: 'Informe a descrição' })
      .trim()
      .min(10, 'A descrição deve ter pelo menos 10 caracteres')
      .max(2000, 'A descrição deve ter no máximo 2000 caracteres'),
    attentionPoints: z
      .string()
      .trim()
      .max(1000, 'Os pontos de atenção devem ter no máximo 1000 caracteres')
      .nullable()
      .optional(),
    startingBid: money('O lance inicial'),
    minimumIncrement: money('O incremento mínimo').optional(),
    imageUrls: z
      .array(z.string(), { required_error: 'Adicione as fotos do produto' })
      .min(1, 'Adicione pelo menos uma foto')
      .max(
        AUCTION_IMAGE_MAX_COUNT,
        `Adicione no máximo ${AUCTION_IMAGE_MAX_COUNT} fotos`,
      ),
  })
  .strict()
