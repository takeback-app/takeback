import 'dotenv/config'
import { Presets, SingleBar } from 'cli-progress'
import { NfceQRCode } from '../useCases/NFCE/NfceQRCode'
import { prisma } from '../prisma'

const PER_LOOP = 5
const RETRIES_LIMIT = 6 * 2 // 2 horas

// Comando executa a cada 10 minutos
async function main() {
  await cancelQRCodes()

  const lastPage = await getLastPage()

  const bar = new SingleBar({}, Presets.shades_classic)

  bar.start(lastPage, 0)

  for (let page = 0; page < lastPage; page++) {
    const qrCodes = await getWaitingQRCodes(page)

    const promises = qrCodes.map((qrCode) =>
      NfceQRCode.makeFromLink(qrCode).createNfce(),
    )

    await Promise.all(promises)

    bar.increment()
  }

  bar.stop()
}

function cancelQRCodes() {
  return prisma.nFCeQRCode.updateMany({
    where: { type: 'WAITING', retries: { gte: RETRIES_LIMIT } },
    data: { type: 'NOT_VALIDATED' },
  })
}

async function getLastPage() {
  const total = await prisma.nFCeQRCode.count({
    where: { type: 'WAITING' },
  })

  return Math.ceil(total / PER_LOOP)
}

function getWaitingQRCodes(page: number) {
  return prisma.nFCeQRCode.findMany({
    where: { type: 'WAITING' },
    orderBy: { createdAt: 'asc' },
    skip: page * PER_LOOP,
    take: PER_LOOP,
  })
}

main()
