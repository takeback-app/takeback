import { getRepository } from "typeorm";
import { Companies } from "../../../database/models/Company";
import { CompanyStatus } from "../../../database/models/CompanyStatus";
import { Industries } from "../../../database/models/Industry";
import { PaymentPlans } from "../../../database/models/PaymentPlans";
import { generateReportExcel } from "../../../utils/GenerateReportExcel";
import { generateReportPDF } from "../../../utils/GenerateReportPDF";
import { unlink } from "fs";
import { maskCNPJ, maskCurrency } from "../../../utils/Masks";
import { CompaniesAddress } from "../../../database/models/CompanyAddress";
import { City } from "../../../database/models/City";
import { State } from "../../../database/models/State";

interface FilterProps {
  statusIds?: string;
  dataActivateStart?: string;
  dataActivateEnd?: string;
  dataCreatedStart?: string;
  dataCreatedEnd?: string;
  industryIds?: string;
  company?: string;
}

interface Props {
  filters?: FilterProps;
}

class CompaniesReportUseCase {
  async execute({ filters }: Props) {
    const query = getRepository(Companies)
      .createQueryBuilder("companies")
      .select([
        "companies.id",
        "companies.registeredNumber",
        "companies.fantasyName",
        "companies.corporateName",
        "companies.email",
        "companies.phone",
        "companies.firstAccessAllowedAt",
        "companies.createdAt",
        "companies.customIndustryFeeActive",
        "companies.customIndustryFee",
      ])
      .addSelect([
        "industries.description",
        "industries.industryFee",
        "status.description",
        "plan.value",
        "plan.description",
        "address.street",
        "address.district",
        "address.number",
        "address.zipCode",
        "address.city",
        "city.name",
        "state.name",
      ])
      .leftJoin(CompaniesAddress, "address", "address.id = companies.address")
      .leftJoin(City, "city", "city.id = address.city")
      .leftJoin(State, "state", "state.id = city.state")
      .leftJoin(Industries, "industries", "industries.id = companies.industry")
      .leftJoin(CompanyStatus, "status", "status.id = companies.status")
      .leftJoin(PaymentPlans, "plan", "plan.id = companies.paymentPlan")
      .orderBy("companies.id", "ASC");

    if (filters.industryIds) {
      const array = [...filters.industryIds];
      const newArray = [];

      array.map((item) => {
        newArray.push(item.replace(/\D/g, ""));
      });

      const myArrayWithoutSpaces = [];
      newArray.filter((res) => {
        if (res !== "") return myArrayWithoutSpaces.push(res);
      });

      query.where("industries.id IN (:...industryIds)", {
        industryIds: [...myArrayWithoutSpaces],
      });
    }

    if (filters.statusIds) {
      const array = [...filters.statusIds];
      const newArray = [];

      array.map((item) => {
        newArray.push(item.replace(/\D/g, ""));
      });

      const myArrayWithoutSpaces = [];
      newArray.filter((res) => {
        if (res !== "") return myArrayWithoutSpaces.push(res);
      });

      query.andWhere("status.id IN (:...statusIds)", {
        statusIds: [...myArrayWithoutSpaces],
      });
    }

    if (filters.dataActivateStart) {
      const date = new Date(filters.dataActivateStart);
      date.setDate(date.getDate());

      query.andWhere(
        `companies.firstAccessAllowedAt >= '${date.toISOString()}'`
      );
    }

    if (filters.dataActivateEnd) {
      const date = new Date(filters.dataActivateEnd);
      date.setDate(date.getDate() + 1);

      query.andWhere(
        `companies.firstAccessAllowedAt <= '${date.toISOString()}'`
      );
    }

    if (filters.dataCreatedStart) {
      const date = new Date(filters.dataCreatedStart);
      date.setDate(date.getDate());

      query.andWhere(`companies.createdAt >= '${date.toISOString()}'`);
    }

    if (filters.dataCreatedEnd) {
      const date = new Date(filters.dataCreatedEnd);
      date.setDate(date.getDate() + 1);

      query.andWhere(`companies.createdAt <= '${date.toISOString()}'`);
    }

    if (filters.company) {
      query.andWhere("companies.fantasyName ILIKE :fantasyName", {
        fantasyName: `%${filters.company}%`,
      });

      query.orWhere("companies.corporateName ILIKE :corporateName", {
        corporateName: `%${filters.company}%`,
      });

      query.orWhere("companies.registeredNumber ILIKE :registeredNumber", {
        registeredNumber: `%${filters.company}%`,
      });
    }

    const report = await query.getRawMany();

    // GERANDO EXCEL
    const titleExcel = [
      "Nome fantasia",
      "Razão social",
      "CNPJ",
      "Email",
      "Telefone",
      "CEP",
      "Estado",
      "Cidade",
      "Bairro",
      "Rua",
      "Número",
      "Cadastro",
      "Primeiro acesso",
      "Ramo",
      "Status",
      "Taxa personalizada",
      "Valor da taxa",
      "Plano de mensalidade",
      "Valor da Mensalidade",
    ];

    const titles = [];
    for await (let headerTitles of titleExcel) {
      titles.push({ text: headerTitles, style: "tableHeader" });
    }

    const excelData = [];
    for await (let result of report) {
      const cells = [];

      let primeiroAcesso = "";
      if (result.companies_firstAccessAllowedAt != null) {
        primeiroAcesso = new Date(
          result.companies_firstAccessAllowedAt
        ).toLocaleDateString();
      } else {
        primeiroAcesso = "Não liberado";
      }

      let taxaPersonalizada = "";
      let taxa = 0;
      if (result.companies_customIndustryFeeActive) {
        taxaPersonalizada = "Ativa";
        taxa = parseFloat(result.companies_customIndustryFee);
      } else {
        taxaPersonalizada = "Inativa";
        taxa = parseFloat(result.industries_industryFee) * 100;
      }

      cells.push(
        result.companies_fantasyName,
        result.companies_corporateName,
        maskCNPJ(result.companies_registeredNumber),
        result.companies_email,
        result.companies_phone,
        result.address_zipCode,
        result.state_name,
        result.city_name,
        result.address_district,
        result.address_street,
        result.address_number,
        new Date(result.companies_createdAt).toLocaleDateString(),
        primeiroAcesso,
        result.industries_description,
        result.status_description,
        taxaPersonalizada,
        taxa.toFixed(1) + "%",
        result.plan_description,
        maskCurrency(result.plan_value)
      );

      excelData.push(cells);
    }

    const excelName = generateReportExcel({
      titles: titleExcel,
      data: excelData,
      reportName: "Relatório de Empresas",
    });

    const filePathExcel = `${process.env.API_URL}/uploads/reports/${excelName}.xlsx`;

    //GERANDO PDF
    const titlePDF = [
      "Nome fantasia",
      "Razão social",
      "CNPJ",
      "Email",
      "Telefone",
      "Cadastro",
      "Primeiro acesso",
      "Ramo",
      "Status",
      "Taxa personalizada",
      "Valor da taxa",
      "Plano de mensalidade",
      "Valor da Mensalidade",
    ];
    const titlesPDF = [];
    for await (let headerTitles of titlePDF) {
      titlesPDF.push({ text: headerTitles, style: "tableHeader" });
    }
    const data = [];
    for await (let result of report) {
      const rows = [];

      let primeiroAcesso = "";
      if (result.companies_firstAccessAllowedAt != null) {
        primeiroAcesso = new Date(
          result.companies_firstAccessAllowedAt
        ).toLocaleDateString();
      } else {
        primeiroAcesso = "Não liberado";
      }

      let taxaPersonalizada = "";
      let taxa = 0;
      if (result.companies_customIndustryFeeActive) {
        taxaPersonalizada = "Ativa";
        taxa = parseFloat(result.companies_customIndustryFee);
      } else {
        taxaPersonalizada = "Inativa";
        taxa = parseFloat(result.industries_industryFee) * 100;
      }

      rows.push(
        { text: result.companies_fantasyName, style: "content" },
        { text: result.companies_corporateName, style: "content" },
        { text: maskCNPJ(result.companies_registeredNumber), style: "content" },
        { text: result.companies_email, style: "content" },
        { text: result.companies_phone, style: "content" },
        {
          text: new Date(result.companies_createdAt).toLocaleDateString(),
          style: "content",
        },
        {
          text: primeiroAcesso,
          style: "content",
        },
        { text: result.industries_description, style: "content" },
        { text: result.status_description, style: "content" },
        { text: taxaPersonalizada, style: "content" },
        { text: taxa.toFixed(1) + "%", style: "content" },
        { text: result.plan_description, style: "content" },
        { text: maskCurrency(result.plan_value), style: "content" }
      );

      data.push(rows);
    }

    const pdfName = generateReportPDF({
      titles: titlesPDF,
      data,
      reportName: "Relatório de Empresas",
    });

    const filePathPDF = `${process.env.API_URL}/uploads/reports/${pdfName}.pdf`;

    const time = 60000;

    setTimeout(() => {
      unlink(`./uploads/reports/${pdfName}.pdf`, (err) => {
        if (err) {
          console.log(err);
        }
      });

      unlink(`./uploads/reports/${excelName}.xlsx`, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }, time * 10); // 10 minutos

    return { report, filePathPDF, filePathExcel };
  }
}

export { CompaniesReportUseCase };
