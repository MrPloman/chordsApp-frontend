function languageIsEmptyObject(value: unknown): value is Record<string, never> {
  // Check if it is a non-null object at runtime
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  // Use Object.keys() to check the number of properties
  return Object.keys(value).length === 0;
}
export const languageHelper = { languageIsEmptyObject };
