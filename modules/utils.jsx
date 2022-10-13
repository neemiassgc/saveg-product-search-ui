export function dateFormatter(value) {
  return isNotNullOrUndefined(value) ? formatDate(value) : "";
}

function formatDate(date) {
  if (isNullOrUndefined(date)) return null;

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${prependZeroIfLessThanTen(day)}/${prependZeroIfLessThanTen(month)}/${year}`
}

function prependZeroIfLessThanTen(number) {
  return number < 10 ? "0"+number : number;
}

export function priceFormatter(value) {
  return isNotNullOrUndefined(value) ? formatPrice(value) : "";
}

function formatPrice(price) {
  let [integerPart, decimalPart] = (""+price).split(".");
  
  if (isNullOrUndefined(decimalPart)) decimalPart = "00"
  else if (decimalPart.length === 1) decimalPart += 0

  return `R$ ${integerPart},${decimalPart}`;
}

export function isNotNullOrUndefined(obj) {
  return obj ? true : false
}

export function isNullOrUndefined(obj) {
  return !obj ? true : false
}

export function isNegative(value) {
  return value < 0
}

export function isPositive(value) {
  return value > 0
}