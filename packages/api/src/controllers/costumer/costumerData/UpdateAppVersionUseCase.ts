import { prisma } from '../../../prisma'

interface Props {
  appVersion: string
  consumerID: string
}

export class UpdateAppVersionUseCase {
  async execute({ appVersion, consumerID }: Props) {
    await prisma.consumer.update({
      where: {
        id: consumerID,
      },
      data: {
        appVersion,
      },
    })

    return 'ok'
  }
}
