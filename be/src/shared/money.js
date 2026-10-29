const unsignedInteger = /^(0|[1-9]\d*)$/;

export function toVnd(value) {
  if (typeof value === 'number' && (!Number.isSafeInteger(value) || value < 0)) {
    throw new TypeError('VND must be a non-negative exact integer');
  }
  if (!['string', 'number', 'bigint'].includes(typeof value) || !unsignedInteger.test(String(value))) {
    throw new TypeError('VND must be a non-negative exact integer');
  }
  return BigInt(value);
}

export const serializeVnd = (value) => toVnd(value).toString();
export const calculateTotalVnd = (unitPrice, quantity) => {
  if (!Number.isSafeInteger(quantity) || quantity <= 0) throw new TypeError('Quantity must be a positive safe integer');
  return (toVnd(unitPrice) * BigInt(quantity)).toString();
};
