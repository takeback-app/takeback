export function convertDate(date: string) {
    const [dia, mes, ano] = date.split(/[\/: ]/).map(v => parseInt(v));
    const data = new Date(ano, mes - 1, dia);

    return data
}