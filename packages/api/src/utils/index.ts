export function isDevelopment() {
  return process.env.APP_ENV === "development";
}

export function filterNumber(value?: number | string) {
  return value ? Number(value) : undefined;
}
