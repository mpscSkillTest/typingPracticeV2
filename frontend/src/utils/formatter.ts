import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";

export const formatToPercent = (value: number | string) => {
  return `${parseFloat(value as string).toFixed(2)}%`;
};

export const formateDate = (value: string) => {
  dayjs.extend(localizedFormat);
  return dayjs(value).format("LL, h:mm A");
};

export const formateDateWithoutTime = (value: string) => {
  dayjs.extend(localizedFormat);
  return dayjs(value).format("LLL");
};
