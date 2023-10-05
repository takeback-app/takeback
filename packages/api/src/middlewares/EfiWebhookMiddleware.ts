import { Request, Response, NextFunction } from 'express'

export const EfiWebhookMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const hmac = request.query.hmac

  if (hmac !== process.env.EFI_WEBHOOK_HMAC) {
    return response.status(400).json()
  }

  next()
}
