/* eslint-disable no-unused-vars */
import { Prisma } from '@prisma/client'
import { Graph } from './CosumersReportsController'
import { BaseConsumersGraphUseCase } from './BaseConsumersGraphUseCase'
import { prisma } from '../../../prisma'

enum SchoolingTypes {
  GRADUATED = 'GRADUATED',
  COMPLETE_HIGH_SCHOOL = 'COMPLETE_HIGH_SCHOOL',
  COMPLETE_PRIMARY_EDUCATION = 'COMPLETE_PRIMARY_EDUCATION',
  ILLITERATE = 'ILLITERATE',
}

export class SchoolingReportUseCase extends BaseConsumersGraphUseCase {
  async getGraphValues(
    customWhere: Prisma.TransactionWhereInput,
  ): Promise<Graph> {
    const completeHighSchool = await prisma.consumer.count({
      where: {
        transactions: {
          some: customWhere,
        },
        schooling: SchoolingTypes.COMPLETE_HIGH_SCHOOL,
      },
    })

    const completePrimaryEducation = await prisma.consumer.count({
      where: {
        transactions: {
          some: customWhere,
        },
        schooling: SchoolingTypes.COMPLETE_PRIMARY_EDUCATION,
      },
    })

    const graduated = await prisma.consumer.count({
      where: {
        transactions: {
          some: customWhere,
        },
        schooling: SchoolingTypes.GRADUATED,
      },
    })

    const illiterate = await prisma.consumer.count({
      where: {
        transactions: {
          some: customWhere,
        },
        schooling: SchoolingTypes.ILLITERATE,
      },
    })

    const allSchooling =
      completeHighSchool + completePrimaryEducation + graduated + illiterate
    const completeHighSchoolPercent = +(
      completeHighSchool / allSchooling
    ).toFixed(4)
    const completePrimaryEducationPercent = +(
      completePrimaryEducation / allSchooling
    ).toFixed(4)
    const graduatedPercent = +(graduated / allSchooling).toFixed(4)
    const illiteratePercent = +(illiterate / allSchooling).toFixed(4)

    return {
      labels: [
        'Superior Completo',
        'Nível Médio Completo',
        'Fundamental Completo',
        'Não Alfabetizado',
      ],
      values: [
        graduatedPercent,
        completeHighSchoolPercent,
        completePrimaryEducationPercent,
        illiteratePercent,
      ],
    }
  }
}
