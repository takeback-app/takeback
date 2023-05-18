import { SeedData } from "../../../utils/seed";

interface GenerateDataProps {
  seedData: SeedData;
  totalValue: number;
  code?: string;
  backValue?: number;
  methods: [number, number][];
}

export function generateData(props: GenerateDataProps) {
  const { seedData, code, backValue, methods, totalValue } = props;

  const method = methods.map((i) => ({
    id: i[0],
    value: i[1],
  }));

  return {
    companyId: seedData.company.id,
    userId: "id",
    companyUserPassword: seedData.companyUserPassword,
    cpf: seedData.consumer.cpf,
    totalAmount: totalValue,
    code: code ?? "",
    backAmount: backValue ?? 0,
    paymentMethods: method,
  };
}
