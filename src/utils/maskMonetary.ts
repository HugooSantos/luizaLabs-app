export const monetaryMask = (value: any): string => {
  value = String(value).replace(/\D/g, '');
  value = parseFloat(value);

  if (isNaN(value)) {
    return monetaryMask("0");
  }

  const formatoMoeda = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });

  let format = formatoMoeda.format(value / 100);
  return format
}

const exp = /^\w{0,3}\W?\s?(\d+)[.,](\d+)?,?(\d+)?$/g
const replacer = (f: any, group1: any, group2: any, group3: any) => {
  return group3 ? `${group1}${group2}.${group3}` : `${group1}.${group2}`
}

export const removeMonetaryMask = (val: any) => {
  return Number(val.replace(exp, replacer))
}