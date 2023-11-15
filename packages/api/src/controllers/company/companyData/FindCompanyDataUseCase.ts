import { prisma } from '../../../prisma'

interface Props {
  companyId: string
}

class FindCompanyDataUseCase {
  async execute({ companyId }: Props) {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: {
        id: true,
        corporateName: true,
        fantasyName: true,
        registeredNumber: true,
        email: true,
        phone: true,
        customIndustryFee: true,
        customIndustryFeeActive: true,
        positiveBalance: true,
        negativeBalance: true,
        monthlyPayment: true,
        createdAt: true,
        updatedAt: true,
        industry: {
          select: {
            id: true,
            description: true,
            industryFee: true,
          },
        },
      },
    })

    return company
  }
}

export { FindCompanyDataUseCase }
