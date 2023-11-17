/* eslint-disable no-unused-vars */
import hbs from 'handlebars'
import { Decimal } from '@prisma/client/runtime'
import { TransactionStatus } from '@prisma/client'
import path from 'path'
import fs from 'fs'
import { MonthlyPaymentUseCase } from '../../../useCases/company/MonthlyPaymentUseCase'
import { FindPendingCashbacksUseCase } from '../companyCashback/FindPendingCashbacksUseCase'
import { FindCompanyDataUseCase } from '../companyData/FindCompanyDataUseCase'

import { InternalError } from '../../../config/GenerateErros'
import { applyCurrencyMask, currency } from '../../../utils/Masks'
import transporter from '../../../config/SMTP'
import { prisma } from '../../../prisma'
import { Notify } from '../../../notifications'
import { NewPaymentOrder } from '../../../notifications/NewPaymentOrder'
import { TransactionStatusEnum } from '../../../enum/TransactionStatusEnum'
import { PaymentOrderStatusEnum } from '../../../enum/PaymentOrderStatusEnum'
import { UpdateCompanyStatusByTransactionsUseCase } from '../companyCashback/UpdateCompanyStatusByTransactionsUseCase'
import { ApproveTransactionUseCase } from '../../../useCases/cashback/ApproveTransactionUseCase'

const TAKEBACK_METHOD = 1
const ADMIN_TAKEBACK_USER = 2

interface GeneratePaymentOrderProps {
  transactionIDs: number[]
  companyId: string
  paymentMethodId: number
}

interface Props {
  companyId: string
  transactionIDs: number[]
  paymentMethodId: number
  monthlyPayment: any[]
}

interface GeneratePaymentOrderWithTakebackBalanceProps {
  transactionIDs: number[]
  companyId: string
  paymentMethodId: number
}

interface ITransactions {
  id: number
  transactionStatus: TransactionStatus
  takebackFeeAmount: Decimal
  cashbackAmount: Decimal
  backAmount: Decimal
  totalAmount: Decimal
}

interface ConsumerToChangeBalanceProps extends ITransactions {
  consumersId: string
}

interface TransactionPerConsumer {
  consumerId: string
  transactions: ITransactions[]
}

interface ConsumerToChangeBalance {
  consumerId: string
  value: number
}

interface CalculateValues {
  preventedTransactions: number[]
  takebackFeeAmount: number
  cashbackAmount: number
  backAmount: number
}

interface HtmlTemplate {
  title: string
  sectionOne: string
  sectionTwo: string
  sectionThree: string
}

enum GeneratePaymentOrderEnum {
  TAKEBACK = 'generatePaymentOrderWithTakebackBalance',
  PIX = 'generatePaymentOrder',
}

enum MonthlyPaymentEnum {
  TAKEBACK = 'payManyWithTakeback',
  PIX = 'payMany',
}
export class GeneratePaymentOrderUseCase {
  async execute({
    companyId,
    transactionIDs,
    paymentMethodId,
    monthlyPayment,
  }: Props) {
    const monthlyPaymentUseCase = new MonthlyPaymentUseCase()
    const findData = new FindCompanyDataUseCase()
    const findCashbacks = new FindPendingCashbacksUseCase()

    const isTakebackMethod = paymentMethodId === TAKEBACK_METHOD

    const paymentOrderType = isTakebackMethod
      ? GeneratePaymentOrderEnum.TAKEBACK
      : GeneratePaymentOrderEnum.PIX

    const monthlyPaymentType = isTakebackMethod
      ? MonthlyPaymentEnum.TAKEBACK
      : MonthlyPaymentEnum.PIX

    const defaultMesseges = {
      generatePaymentOrder:
        'Estamos processando o pagamento, isso pode levar algumas horas.',
      generatePaymentOrderWithTakebackBalance: 'Cashbacks liberados 🤑',
    }

    const message = transactionIDs.length
      ? await this[paymentOrderType]({
          transactionIDs,
          companyId,
          paymentMethodId,
        })
      : defaultMesseges[paymentOrderType]

    if (monthlyPayment.length) {
      const parsedMonthlyPayment = monthlyPayment.map((m) =>
        Number(m.replace(/\D/g, '')),
      )
      await monthlyPaymentUseCase[monthlyPaymentType](parsedMonthlyPayment)
    }

    const companyData = await findData.execute({ companyId })

    const transactions = await findCashbacks.execute({ companyId })

    return { message, companyData, transactions }
  }

  async generatePaymentOrder({
    transactionIDs,
    companyId,
    paymentMethodId,
  }: GeneratePaymentOrderProps) {
    if (!paymentMethodId || transactionIDs.length === 0) {
      throw new InternalError('Campos incompletos', 400)
    }

    const company = await prisma.company.findUnique({
      where: { id: companyId },
    })

    if (!company) {
      throw new InternalError('Empresa inexistente', 404)
    }

    const processStatus = await prisma.transactionStatus.findFirst({
      where: { description: TransactionStatusEnum.PROCESSING },
    })

    const transactionsLocalized = await this.findTransactions(transactionIDs)

    const {
      preventedTransactions,
      takebackFeeAmount,
      cashbackAmount,
      backAmount,
    } = await this.calculateValues(transactionsLocalized, processStatus.id)

    if (preventedTransactions.length !== 0) {
      return 'Há cashbacks em processamento'
    }

    const awaitingStatus = await prisma.paymentOrderStatus.findFirst({
      where: { description: PaymentOrderStatusEnum.WAITING_CONFIRMATION },
    })

    const paymentMethod = await prisma.paymentOrderMethod.findUnique({
      where: { id: paymentMethodId },
    })

    const paymentOrder = await prisma.paymentOrder.create({
      data: {
        value: takebackFeeAmount + cashbackAmount + backAmount,
        company: {
          connect: { id: company.id },
        },
        paymentOrderStatus: {
          connect: { id: awaitingStatus.id },
        },
        paymentOrderMethod: {
          connect: { id: paymentMethod.id },
        },
      },
      include: {
        company: { select: { fantasyName: true } },
      },
    })

    await prisma.transaction.updateMany({
      where: { id: { in: transactionIDs } },
      data: {
        transactionStatusId: processStatus.id,
        paymentOrderId: paymentOrder.id,
      },
    })

    const users = await prisma.takebackUser.findMany({
      where: { userTypeId: ADMIN_TAKEBACK_USER, isActive: true },
    })

    Notify.sendMany(
      users,
      new NewPaymentOrder(paymentOrder, company.fantasyName),
    )

    const settings = await prisma.setting.findUnique({
      where: { id: 1 }, // só há um registro na tabela
      select: { takebackPixKey: true },
    })

    const htmlTemplate = {
      title: `Solicitação de Pagamento`,
      sectionOne: `Recebemos a sua solicitação de pagamento referente à ordem N°${
        paymentOrder.id
      } no valor de ${currency(Number(paymentOrder.value))}`,
      sectionTwo: `Estamos processando o seu pagamento, caso ainda não tenha o efetuado segue a nossa chave PIX: ${settings.takebackPixKey}`,
      sectionThree: 'Abraços! Equipe TakeBack :)',
    }

    this.sendMail(
      htmlTemplate,
      'TakeBack | Pagamento de Cashbacks',
      company.email,
    )

    return 'Estamos processando o pagamento, isso pode levar algumas horas.'
  }

  async generatePaymentOrderWithTakebackBalance({
    companyId,
    paymentMethodId,
    transactionIDs,
  }: GeneratePaymentOrderWithTakebackBalanceProps) {
    if (!paymentMethodId || transactionIDs.length === 0) {
      throw new InternalError('Campos incompletos', 400)
    }

    const company = await prisma.company.findUnique({
      where: { id: companyId },
    })

    if (!company) {
      throw new InternalError('Empresa inexistente', 404)
    }

    const approvedStatusTransaction = await prisma.transactionStatus.findFirst({
      where: { description: TransactionStatusEnum.APPROVED },
    })

    const transactions = await this.findTransactions(transactionIDs)

    const consumerToChangeBalance =
      this.generateConsumerToChangeBalance(transactions)

    const {
      preventedTransactions,
      takebackFeeAmount,
      cashbackAmount,
      backAmount,
    } = await this.calculateValues(transactions, approvedStatusTransaction.id)

    if (preventedTransactions.length !== 0) {
      return {
        message: 'Há cashbacks em processamento',
        cashbacks: preventedTransactions,
      }
    }

    const approvedStatus = await prisma.paymentOrderStatus.findFirst({
      where: { description: PaymentOrderStatusEnum.AUTHORIZED },
    })

    const paymentMethod = await prisma.paymentOrderMethod.findUnique({
      where: { id: TAKEBACK_METHOD },
    })

    if (
      Number(company.positiveBalance) <
      takebackFeeAmount + cashbackAmount + backAmount
    ) {
      throw new InternalError('Saldo Takeback insuficiente', 400)
    }

    const paymentOrder = await prisma.paymentOrder.create({
      data: {
        value: takebackFeeAmount + cashbackAmount + backAmount,
        company: {
          connect: { id: company.id },
        },
        paymentOrderStatus: {
          connect: { id: approvedStatus.id },
        },
        paymentOrderMethod: {
          connect: { id: paymentMethod.id },
        },
      },
      include: {
        company: {
          select: { fantasyName: true },
        },
      },
    })

    const useCase = new ApproveTransactionUseCase(paymentOrder.id)

    for (const item of transactions) {
      await useCase.execute({
        companyName: paymentOrder.company.fantasyName,
        consumersId: item.consumersId,
        totalAmount: Number(item.totalAmount),
        transactionId: item.id,
      })
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
      where: { id: companyId },
      data: {
        positiveBalance: {
          decrement: takebackFeeAmount + cashbackAmount + backAmount,
        },
        negativeBalance: takebackFeeAmount + cashbackAmount + backAmount,
      },
    })

    await new UpdateCompanyStatusByTransactionsUseCase().execute(companyId)

    const htmlTemplate = {
      title: `Cashbacks liberados 🤑`,
      sectionOne: `Você acabou de alegrar o dia de ${consumerToChangeBalance.length} dos seus clientes disponibilizando o saldo deles.`,
      sectionTwo: `Ordem de pagamento N°${
        paymentOrder.id
      } | Valor liberado: ${applyCurrencyMask(
        cashbackAmount,
      )} | Taxas operacionais: ${applyCurrencyMask(
        takebackFeeAmount,
      )} | Total: ${applyCurrencyMask(Number(paymentOrder.value))}`,
      sectionThree: 'Abraços! Equipe TakeBack :)',
    }

    this.sendMail(
      htmlTemplate,
      'TakeBack | Liberação de Cashbacks',
      company.email,
    )

    return 'Cashbacks liberados 🤑'
  }

  private async findTransactions(
    transactionIDs: number[],
  ): Promise<ConsumerToChangeBalanceProps[]> {
    const transaction = await prisma.transaction.findMany({
      where: {
        id: { in: transactionIDs },
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
    return transaction
  }

  private generateConsumerToChangeBalance(
    transactions: ConsumerToChangeBalanceProps[],
  ): ConsumerToChangeBalance[] {
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
            total +
            Number(transaction.cashbackAmount) +
            Number(transaction.backAmount),
          0,
        )

        return {
          consumerId: item.consumerId,
          value: value,
        }
      },
    )

    return consumerToChangeBalance
  }

  private async calculateValues(
    transactions: ITransactions[],
    preventedTransactionStatusId: number,
  ): Promise<CalculateValues> {
    const preventedTransactions = []
    let takebackFeeAmount = 0
    let cashbackAmount = 0
    let backAmount = 0

    for (const item of transactions) {
      if (item.transactionStatus.id === preventedTransactionStatusId) {
        preventedTransactions.push(item.id)
      }

      takebackFeeAmount += Number(item.takebackFeeAmount)
      cashbackAmount += Number(item.cashbackAmount)
      backAmount += Number(item.backAmount)
    }

    return {
      preventedTransactions,
      takebackFeeAmount,
      cashbackAmount,
      backAmount,
    }
  }

  private async sendMail(
    htmlTemplate: HtmlTemplate,
    subject: string,
    companyEmail: string,
  ) {
    const emailTemplate = fs.readFileSync(
      path.resolve('src/utils/emailTemplates/template1.hbs'),
      'utf-8',
    )

    const template = hbs.compile(emailTemplate)

    const html = template(htmlTemplate)

    const mailOptions = {
      from: process.env.MAIL_CONFIG_USER,
      to: companyEmail,
      subject,
      html,
    }

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        return 'Houve um erro ao enviar o email.'
      } else {
        return 'Email enviado.'
      }
    })
  }
}
