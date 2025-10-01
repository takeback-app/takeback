import { Decimal } from '@prisma/client/runtime'
import hbs from 'handlebars'
import fs from 'fs'
import path from 'path'
import { InternalError } from '../../../../config/GenerateErros'
import transporter from '../../../../config/SMTP'
import { ApproveTransactionUseCase } from '../../../../useCases/cashback/ApproveTransactionUseCase'
import { applyCurrencyMask } from '../../../../utils/Masks'
import { prisma } from '../../../../prisma'
import { TransactionStatusEnum } from '../../../../enum/TransactionStatusEnum'
import { PaymentOrderStatusEnum } from '../../../../enum/PaymentOrderStatusEnum'
import { TransactionPerConsumer } from '../../../company/companyPaymentOrder/GeneratePaymentOrderUseCase'
import { UpdateCompanyStatusByTransactionsUseCase } from '../../../company/companyCashback/UpdateCompanyStatusByTransactionsUseCase'

interface OrderProps {
  paymentOrderId: number
}

class ApproveOrderAndReleaseCashbacksUseCase {
  async execute({ paymentOrderId }: OrderProps) {
    if (!paymentOrderId) {
      throw new InternalError('Ordem de pagamento não informada', 400)
    }

    const paymentOrder = await prisma.paymentOrder.findUnique({
      where: { id: paymentOrderId },
      include: {
        company: {
          select: {
            id: true,
            email: true,
            fantasyName: true,
          },
        },
      },
    })

    if (!paymentOrder) {
      throw new InternalError('Ordem de pagamento não localizada', 404)
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        paymentOrderId,
        transactionStatus: {
          description: {
            in: [
              TransactionStatusEnum.PENDING,
              TransactionStatusEnum.ON_DELAY,
              TransactionStatusEnum.PROCESSING,
            ],
          },
        },
      },
      select: {
        id: true,
        transactionStatus: true,
        takebackFeeAmount: true,
        cashbackAmount: true,
        backAmount: true,
        totalAmount: true,
        consumersId: true,
      },
    })

    const transactionIDs = transactions.map((transaction) => transaction.id)

    const transactionsForPaymentOrder = await prisma.transaction.count({
      where: {
        paymentOrderId,
      },
    })
    if (transactionsForPaymentOrder !== transactionIDs.length) {
      throw new InternalError(
        'Já existem pagamentos sendo processados. Aguarde alguns minutos recarregue a página e tente novamente.',
        404,
      )
    }

    const approvedStatusTransaction = await prisma.transactionStatus.findFirst({
      where: { description: TransactionStatusEnum.APPROVED },
    })

    await prisma.transaction.updateMany({
      where: {
        id: { in: transactionIDs },
        approvedAt: null,
        paymentOrderId: null,
        transactionStatus: {
          description: {
            in: [
              TransactionStatusEnum.PENDING,
              TransactionStatusEnum.ON_DELAY,
              TransactionStatusEnum.PROCESSING,
            ],
          },
        },
      },
      data: { transactionStatusId: approvedStatusTransaction.id },
    })
    let html

    try {
      const transactionsGrouped = transactions.reduce((acc, currentValue) => {
        const { consumersId, ...rest } = currentValue

        if (!acc[consumersId]) {
          acc[consumersId] = { consumerId: consumersId, transactions: [] }
        }

        acc[consumersId].transactions.push({ consumersId, ...rest })

        return acc
      }, {})

      const transactionGroupedPerConsumer = Object.values(
        transactionsGrouped,
      ) as TransactionPerConsumer[]

      const consumerToChangeBalance = transactionGroupedPerConsumer.map(
        (item) => {
          const value = item.transactions.reduce(
            (total, transaction) =>
              total
                .plus(transaction.cashbackAmount)
                .plus(transaction.backAmount),
            new Decimal(0),
          )

          return {
            consumerId: item.consumerId,
            value: value,
          }
        },
      )

      let takebackFeeAmount = new Decimal(0)
      let cashbackAmount = new Decimal(0)
      let backAmount = new Decimal(0)

      const useCase = new ApproveTransactionUseCase(paymentOrder.id)

      for await (const item of transactions) {
        await useCase.execute({
          companyName: paymentOrder.company.fantasyName,
          consumersId: item.consumersId,
          totalAmount: Number(item.totalAmount),
          transactionId: item.id,
        })
        takebackFeeAmount = takebackFeeAmount.plus(item.takebackFeeAmount)
        cashbackAmount = cashbackAmount.plus(item.cashbackAmount)
        backAmount = backAmount.plus(item.backAmount)
      }

      for (const item of consumerToChangeBalance) {
        await prisma.consumer.update({
          where: { id: item.consumerId },
          data: {
            blockedBalance: { decrement: item.value },
            balance: { increment: item.value },
          },
        })
      }

      await prisma.company.update({
        where: { id: paymentOrder.company.id },
        data: {
          negativeBalance: {
            decrement: paymentOrder.value,
          },
        },
      })

      const approvedStatus = await prisma.paymentOrderStatus.findFirst({
        where: { description: PaymentOrderStatusEnum.AUTHORIZED },
      })

      await prisma.paymentOrder.update({
        where: { id: paymentOrderId },
        data: { statusId: approvedStatus.id, approvedAt: new Date() },
      })

      await new UpdateCompanyStatusByTransactionsUseCase().execute(
        paymentOrder.company.id,
      )

      const emailTemplate = fs.readFileSync(
        path.resolve('src/utils/emailTemplates/template1.hbs'),
        'utf-8',
      )

      const template = hbs.compile(emailTemplate)

      html = template({
        title: `Cashbacks liberados 🤑`,
        sectionOne: `Você acabou de alegrar o dia de ${consumerToChangeBalance.length} dos seus clientes disponibilizando o saldo deles.`,
        sectionTwo: `Ordem de pagamento N°${
          paymentOrder.id
        } | Valor liberado: ${applyCurrencyMask(
          cashbackAmount.toNumber(),
        )} | Taxas operacionais: ${applyCurrencyMask(
          cashbackAmount.toNumber(),
        )} | Total: ${applyCurrencyMask(paymentOrder.value.toNumber())}`,
        sectionThree: 'Abraços! Equipe TakeBack :)',
      })
    } catch (error) {
      const processingStatusTransaction =
        await prisma.transactionStatus.findFirst({
          where: { description: TransactionStatusEnum.PROCESSING },
        })

      await prisma.transaction.updateMany({
        where: {
          id: { in: transactionIDs },
          transactionStatus: {
            description: {
              in: [TransactionStatusEnum.APPROVED],
            },
          },
        },
        data: { transactionStatusId: processingStatusTransaction.id },
      })
      throw new InternalError('Erro ao liberar cashbacks', 400)
    }

    const mailOptions = {
      from: process.env.MAIL_CONFIG_USER,
      to: paymentOrder.company.email,
      subject: 'TakeBack | Liberação de Cashbacks',
      html,
    }

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        return 'Houve um erro ao enviar o email.'
      } else {
        return 'Email enviado.'
      }
    })

    return 'Ordem de Pagamento aprovada!'
  }
}

export { ApproveOrderAndReleaseCashbacksUseCase }
