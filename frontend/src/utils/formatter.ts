import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";

export const formatToPercent = (value: number | string) => {
  return `${parseFloat(value as string).toFixed(2)}%`;
};

export const formateDate = (value: string) => {
  dayjs.extend(localizedFormat);
  return dayjs(value).format("DD/MM/YYYY, h:mm A");
};
