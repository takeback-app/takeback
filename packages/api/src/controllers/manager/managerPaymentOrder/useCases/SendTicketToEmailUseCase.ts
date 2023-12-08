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
  fileName: string
  filePath: string
  fileOriginalName: string
  useCustomEmail: string
  customEmail: string
}

class SendTicketToEmailUseCase {
  async execute({
    paymentOrderId,
    fileName,
    filePath,
    fileOriginalName,
    useCustomEmail,
    customEmail,
  }: Props) {
    if (!paymentOrderId || !fileName || !filePath) {
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
      title: 'Boleto TakeBack',
      sectionOne: `Segue em anexo o boleto para o pagamento dos cashbacks contidos na ordem de pagamento número: ${
        paymentOrder.paymentOrder_id
      }, no valor de ${maskCurrency(paymentOrder.paymentOrder_value)} .`,
    })

    const mailOptions = {
      from: process.env.MAIL_CONFIG_USER,
      to: useCustomEmail === 'true' ? customEmail : paymentOrder.company_email,
      subject: 'TakeBack - Boleto TakeBack',
      html,
      attachments: [
        {
          filename: fileOriginalName,
          path: filePath,
        },
      ],
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
        ticketName: fileName,
        ticketPath: filePath,
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

export { SendTicketToEmailUseCase }
