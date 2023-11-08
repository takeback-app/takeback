import { prisma } from '../../../prisma'

interface Props {
  appVersion: string
  consumerID: string
}

export class ConsumerAppVersionUseCase {
  async updateAppVersion({ appVersion, consumerID }: Props) {
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

  async getAppVersion(consumerID: string) {
    const appVersion = await prisma.consumer.findUnique({
      where: {
        id: consumerID,
      },
      select: {
        appVersion: true,
      },
    })

    return appVersion
  }
}
