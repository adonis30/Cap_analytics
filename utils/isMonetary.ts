export const isMonetary = (metric?: string): boolean => {
  return /(usd|revenue|income|cost|investment|expenditure|value)/i.test(metric ?? "");
};
