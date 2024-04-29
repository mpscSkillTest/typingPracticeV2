import dayjs from "dayjs";

export const getNextBillingDate = (nextBillingDate = null) => {
  const currentBillingDate = dayjs(nextBillingDate);

  /**
   * if no billing date is provided
   */
  if (!currentBillingDate.isValid()) {
    return dayjs().add(30, "day").toISOString();
  }

  /**
   * if current billing date is in past
   */
  if (
    dayjs().isAfter(currentBillingDate, "day") ||
    dayjs().isSame(currentBillingDate, "day")
  ) {
    return dayjs().add(30, "day").toISOString();
  }

  // if current billing date is in future then set billing date 30 days after current billing date
  return currentBillingDate.add(30, "day").toISOString();
};
