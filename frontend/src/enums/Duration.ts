import dayjs from "dayjs";

const TODAY = dayjs().format("YYYY-MM-DD");
const YESTERDAY = dayjs().subtract(1, "day").format("YYYY-MM-DD");
const LAST_FORTNIGHT = dayjs().subtract(15, "day").format("YYYY-MM-DD");
const LAST_WEEK = dayjs().subtract(7, "day").format("YYYY-MM-DD");
const LAST_MONTH = dayjs().subtract(30, "day").format("YYYY-MM-DD");

export const Duration = Object.freeze({
  TODAY: {
    name: "Today",
    value: {
      from: TODAY,
      to: TODAY,
    },
  },
  YESTERDAY: {
    name: "Yesterday",
    value: {
      from: YESTERDAY,
      to: YESTERDAY,
    },
  },
  LAST_WEEK: {
    name: "Last Week",
    value: {
      from: LAST_WEEK,
      to: TODAY,
    },
  },
  LAST_FORTNIGHT: {
    name: "Last 15 Days",
    value: {
      from: LAST_FORTNIGHT,
      to: TODAY,
    },
  },
  LAST_MONTH: {
    name: "Last Month",
    value: {
      from: LAST_MONTH,
      to: TODAY,
    },
  },
});
