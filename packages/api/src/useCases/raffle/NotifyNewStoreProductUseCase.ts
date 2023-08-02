import { StoreProduct } from '@prisma/client'
import { Notify } from '../../notifications'
import { NewStoreProduct } from '../../notifications/NewStoreProduct'
import { prisma } from '../../prisma'

export class NotifyNewStoreProductUseCase {
  async execute(storeProduct: StoreProduct) {
    const address = await prisma.companyAddress.findFirst({
      where: { company: { id: storeProduct.companyId } },
      select: { cityId: true },
    })

    if (!address) return

    const consumers = await prisma.consumer.findMany({
      where: {
        consumerAddress: { cityId: address.cityId },
      },
      select: { id: true, expoNotificationToken: true },
    })

    const company = await prisma.company.findUniqueOrThrow({
      where: { id: storeProduct.companyId },
      select: { fantasyName: true },
    })

    Notify.sendMany(
      consumers,
      new NewStoreProduct(storeProduct.id, company.fantasyName),
    )
  }
}
