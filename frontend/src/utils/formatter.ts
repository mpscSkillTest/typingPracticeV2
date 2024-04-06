export const formatToPercent = (value: number | string) => {
  return `${parseFloat(value as string).toFixed(2)}%`;
};
