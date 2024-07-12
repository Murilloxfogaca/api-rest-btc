export function isEmailValid(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function formatToNumeric10_8(value: string): number {
  let formattedValue = parseFloat(value).toFixed(8);
  return parseFloat(formattedValue);
}

export function formatToNumericReal(value): number {
  let formattedValue = parseFloat(value).toFixed(2);
  return parseFloat(formattedValue);
}

export function formatRoundOff(value: number): number {
  return parseFloat(value.toFixed(10));
}
