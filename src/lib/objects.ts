export const omit = <T>(obj: T, k: keyof T): T => {
  if (!obj[k]) {
      return obj;
  }
  const clone = { ...obj };
  delete clone[k];
  return clone;
};
