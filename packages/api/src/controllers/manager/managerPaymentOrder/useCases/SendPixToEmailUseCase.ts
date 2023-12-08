import { getRepository, ILike } from 'typeorm'
import hbs from 'handlebars'
import path from 'path'
import fs from 'fs'

import transporter from '../../../../config/SMTP'
import { InternalError } from '../../../../config/GenerateErros'
import { Companies } from '../../../../database/models/Company'
import { PaymentOrder } from '../../../../database/models/PaymentOrder'
import { PaymentOrderStatus } from '../../../../database/models/PaymentOrderStatus'
import { maskCurrency } from '../../../../utils/Masks'

interface Props {
  paymentOrderId: number
  pixKey: string
  useCustomEmail: string
  customEmail: string
}

class SendPixToEmailUseCase {
  async execute({
    paymentOrderId,
    pixKey,
    useCustomEmail,
    customEmail,
  }: Props) {
    if (!paymentOrderId || !pixKey) {
      throw new InternalError('Boleto não informado', 400)
    }

    if (useCustomEmail === 'true' && !customEmail) {
      throw new InternalError('Email não informado', 400)
    }

    const paymentOrder = await getRepository(PaymentOrder)
      .createQueryBuilder('paymentOrder')
      .select(['paymentOrder.id', 'paymentOrder.value'])
      .addSelect(['company.id', 'company.email'])
      .leftJoin(Companies, 'company', 'company.id = paymentOrder.company')
      .where('paymentOrder.id = :paymentOrderId', { paymentOrderId })
      .getRawOne()

    if (!paymentOrder) {
      throw new InternalError('Ordem de pagamento não localizada', 404)
    }

    const company = await getRepository(Companies).findOne({
      where: { id: paymentOrder.company_id },
    })

    if (!company) {
      throw new InternalError('Empresa não localizada', 404)
    }
    // CONFIGURAÇÃO ENVIO DE EMAIL COM TEMPLATE
    const emailTemplate = fs.readFileSync(
      path.resolve('src/utils/emailTemplates/template1.hbs'),
      'utf-8',
    )

    const template = hbs.compile(emailTemplate)

    const html = template({
      title: 'Pagamento TakeBack',
      sectionOne: `Segue a chave PIX para o pagamento dos cashbacks contidos na ordem de pagamento n° ${
        paymentOrder.paymentOrder_id
      }, no valor de ${maskCurrency(
        paymentOrder.paymentOrder_value,
      )}. Esta chave pix é do tipo copia e cola, ou seja,
      basta selecionar e copiar a chave para usá-la.`,
      linkPix: pixKey,
    })

    const mailOptions = {
      from: process.env.MAIL_CONFIG_USER,
      to: useCustomEmail === 'true' ? customEmail : paymentOrder.company_email,
      subject: 'TakeBack - Pagamento TakeBack',
      html,
    }

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        return process.exit(1)
      } else {
        transporter.close()
      }
    })

    const paymentOrderStatus = await getRepository(PaymentOrderStatus).findOne({
      where: { description: ILike('aguardando confirmacao') },
    })

    const updatedPaymentOrder = await getRepository(PaymentOrder).update(
      paymentOrderId,
      {
        pixKey,
        status: paymentOrderStatus,
      },
    )

    if (updatedPaymentOrder.affected === 0) {
      throw new InternalError(
        'Ouve um erro ao atualizar o status da ordem de pagamento',
        400,
      )
    }

    return 'Email enviado'
  }
}

export { SendPixToEmailUseCase }
