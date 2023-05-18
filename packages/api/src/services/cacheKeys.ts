export function solicitationKey(companyId: string) {
  return `solicitation-count:${companyId}`;
}

export function notificationCountKey(consumerId: string) {
  return `notification-count:${consumerId}`;
}
