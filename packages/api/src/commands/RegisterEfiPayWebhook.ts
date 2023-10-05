import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname + '../../../.env') })

// eslint-disable-next-line import/first
import { Efipay } from '../services/efipay'

async function main() {
  const efipay = Efipay.make()

  await efipay.pixDeleteWebhook()

  const webhookUrl = `${process.env.API_URL}/efipay/webhook`

  const response = await efipay.pixConfigWebhook(webhookUrl)

  console.log(response)
}

main()
