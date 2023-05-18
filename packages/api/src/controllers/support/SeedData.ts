export const StatesSeed = [
  {
    name: "Acre",
    initials: "AC",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Alagoas",
    initials: "AL",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Amapá",
    initials: "AP",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Amazonas",
    initials: "AM",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Bahia",
    initials: "BA",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Ceará",
    initials: "CE",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Espírito Santo",
    initials: "ES",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Goiás",
    initials: "Go",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Maranhão",
    initials: "MA",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Mato Grosso",
    initials: "MT",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Mato Grosso do Sul",
    initials: "MS",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Minas Gerais",
    initials: "MG",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Pará",
    initials: "PA",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Paraíba",
    initials: "PB",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Paraná",
    initials: "PR",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Pernambuco",
    initials: "PE",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Piauí",
    initials: "PI",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Rio de Janeiro",
    initials: "RJ",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Rio Grande do Norte",
    initials: "RN",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Rio Grande do Sul",
    initials: "RS",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Rondônia",
    initials: "RO",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Roraima",
    initials: "RR",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Santa Catarina",
    initials: "SC",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "São Paulo",
    initials: "SP",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Sergipe",
    initials: "SE",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Tocantins",
    initials: "TO",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Distrito Federal",
    initials: "DF",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const PaymentOrderMethodsSeed = [
  {
    description: "Saldo Takeback",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    description: "PIX",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    description: "Boleto",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const TransactionStatusSeed = [
  {
    description: "Pendente",
    blocked: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    description: "Aprovada",
    blocked: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    description: "Pago com takeback",
    blocked: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    description: "Aguardando",
    blocked: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    description: "Cancelada pelo parceiro",
    blocked: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    description: "Cancelada pelo cliente",
    blocked: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    description: "Em processamento",
    blocked: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    description: "Em atraso",
    blocked: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    description: "Não paga pelo parceiro",
    blocked: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const CompanyUserTypesSeed = [
  {
    description: "Administrador",
    isManager: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    description: "Caixa",
    isManager: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const PaymentPlanSeed = [
  {
    description: "Plano padrão",
    value: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const SettingsSeed = [
  {
    payDate: 15,
    provisionalAccessDays: 10,
    takebackPixKey: "your-pix-key",
    takebackQRCode: "your-qrcode-string",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const PaymentOrderStatusSeed = [
  {
    description: "Pagamento solicitado",
  },
  {
    description: "Aguardando confirmacao",
  },
  {
    description: "Cancelada",
  },
  {
    description: "Autorizada",
  },
];

export const CompanyStatusSeed = [
  {
    description: "Ativo",
    blocked: false,
    generateCashback: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    description: "Liberação provisória",
    blocked: false,
    generateCashback: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    description: "Cadastro solicitado",
    blocked: true,
    generateCashback: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    description: "Em análise",
    blocked: true,
    generateCashback: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    description: "Documentação pendente",
    blocked: true,
    generateCashback: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    description: "Demonstração",
    blocked: false,
    generateCashback: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    description: "Inadimplente por cashbacks",
    blocked: false,
    generateCashback: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    description: "Inadimplente por mensalidade",
    blocked: false,
    generateCashback: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    description: "Cadastro não aprovado",
    blocked: true,
    generateCashback: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    description: "Bloqueado",
    blocked: true,
    generateCashback: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const tbUserTypes = [
  {
    description: "Root",
    isRoot: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    description: "Administrativo",
    isRoot: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
