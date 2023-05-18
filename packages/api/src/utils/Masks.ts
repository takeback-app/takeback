export const maskCurrency = (value: string): string => {
  return (Number(value.replace(/\D/g, "")) / 10000).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export const currency = (number: number): string => {
  return number.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export const applyCurrencyMask = (value: number): string => {
  return maskCurrency((parseFloat(value.toFixed(4)) * 10000).toString());
};

export const unMaskCurrency = (value: string): number => {
  return typeof value === "number"
    ? value
    : Number(value.replace(/\D/g, "")) / 100;
};

export const maskCPF = (value: string): string => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
};

export const maskCEP = (value: string): string => {
  return value.replace(/\D/g, "").replace(/^(\d{5})(\d{3})+?$/, "$1-$2");
};

export const maskCNPJ = (v: string): string => {
  v = v.replace(/\D/g, "");

  v = v.replace(/^(\d{2})(\d)/, "$1.$2");
  v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
  v = v.replace(/\.(\d{3})(\d)/, ".$1/$2");
  v = v.replace(/(\d{4})(\d)/, "$1-$2");

  return v;
};

export const maskPhone = (value: string): string => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{4})(\d)/, "$1-$2");
};
