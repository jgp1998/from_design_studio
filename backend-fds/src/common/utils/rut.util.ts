export function cleanRut(rut: string): string {
  if (!rut) return '';
  return rut.replace(/[^0-9kK]/g, '').toUpperCase();
}

export function validateRut(rut: string): boolean {
  const cleaned = cleanRut(rut);
  if (cleaned.length < 2) return false;

  const dv = cleaned.slice(-1);
  const body = cleaned.slice(0, -1);

  let sum = 0;
  let multiplier = 2;

  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body.charAt(i), 10) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const expectedDvResult = 11 - (sum % 11);
  let expectedDv = expectedDvResult.toString();
  if (expectedDvResult === 11) expectedDv = '0';
  if (expectedDvResult === 10) expectedDv = 'K';

  return dv === expectedDv;
}
