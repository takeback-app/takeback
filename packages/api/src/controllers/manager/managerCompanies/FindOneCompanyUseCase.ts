import { getRepository } from "typeorm";
import { City } from "../../../database/models/City";
import { Companies } from "../../../database/models/Company";
import { CompaniesAddress } from "../../../database/models/CompanyAddress";
import { CompanyStatus } from "../../../database/models/CompanyStatus";
import { Industries } from "../../../database/models/Industry";
import { PaymentPlans } from "../../../database/models/PaymentPlans";
import { Representative } from "../../../database/models/Representative";

interface Props {
  companyId: string;
}

class FindOneCompanyUseCase {
  async execute({ companyId }: Props) {
    const company = await getRepository(Companies)
      .createQueryBuilder("company")
      .select([
        "company.id",
        "company.fantasyName",
        "company.corporateName",
        "company.registeredNumber",
        "company.email",
        "company.phone",
        "company.positiveBalance",
        "company.negativeBalance",
        "company.monthlyPayment",
        "company.customIndustryFee",
        "company.customIndustryFeeActive",
        "company.contactPhone",
      ])
      .addSelect([
        "industry.id",
        "industry.description",
        "industry.industryFee",
        "status.description",
        "status.id",
        "address.street",
        "address.district",
        "address.number",
        "city.id",
        "city.name",
        "plan.id",
        "plan.description",
        "plan.value",
        "representative.id",
        "representative.name",
      ])
      .leftJoin(Industries, "industry", "industry.id = company.industry")
      .leftJoin(CompanyStatus, "status", "status.id = company.status")
      .leftJoin(CompaniesAddress, "address", "address.id = company.address")
      .leftJoin(City, "city", "city.id = address.city")
      .leftJoin(PaymentPlans, "plan", "plan.id = company.paymentPlan")
      .leftJoin(
        Representative,
        "representative",
        "representative.id = company.representative"
      )
      .where("company.id = :companyId", {
        companyId,
      })
      .getRawOne();

    return company;
  }
}

export { FindOneCompanyUseCase };
