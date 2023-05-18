export enum TransactionStatusEnum {
  PENDING = 'Pendente',
  APPROVED = 'Aprovado',
  PAID_WITH_TAKEBACK = 'Pago com takeback',
  WAITING = 'Aguardando',
  CANCELED_BY_PARTNER = 'Cancelada pelo parceiro',
  CANCELED_BY_CLIENT = 'Cancelada pelo cliente',
  PROCESSING = 'Em processamento',
  ON_DELAY = 'Em atraso',
  NOT_PAID = 'Não paga pelo parceiro',
  TAKEBACK_BONUS = 'Gratificação Takeback'
}
