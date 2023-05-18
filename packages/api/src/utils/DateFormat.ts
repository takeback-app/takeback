const days = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];
const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export const format = (date: Date): string => {
  return `${days[date.getDay()]}, ${date.getDate()} de ${
    months[date.getMonth()]
  } de ${date.getFullYear()} as ${date.getHours()}h${date.getMinutes()}m`;
};
