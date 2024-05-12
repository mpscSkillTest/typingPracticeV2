import { config } from "dotenv";
import { StatusCodes } from "http-status-codes";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat.js";
import { supabase } from "../../dbClient.js";
import { getUserIdFromToken } from "../../utils/utils.js";
import { getNextBillingDate } from "../../utils/getNextBillingDate.js";
import { SUBSCRIPTION_DB_NAME, PAYMENT_DB_NAME } from "../../constant.js";
import logger from "../../utils/logger.js";

config();

dayjs.extend(localizedFormat);

export const addNewSubscriptionDetails = async (req, res) => {
  logger.info("Adding new subscription for user: Everything is OK");

  const { productId, transactionId, amount } = req.body || {};

  try {
    const userId = await getUserIdFromToken(req);

    if (!userId) {
      logger.error(
        `Fetched User Id for new subscription:${userId} user not found`
      );
      throw new Error("User not found. Please try again");
    }

    logger.info(
      `Adding new user for ${userId} productId:${productId} Everything is OK`
    );

    const { data: existingSubscriptionData, error: existingSubscriptionError } =
      await supabase
        .from(SUBSCRIPTION_DB_NAME)
        .select(
          `
          id,
          next_billing_date
        `
        )
        .eq("user_id", userId)
        .eq("product_id", productId);

    if (existingSubscriptionError) {
      logger.error(
        `Adding subscription details: for user while selecting subscription details: ${userId}`
      );
      throw new Error(existingSubscriptionError?.message);
    }

    const { id, next_billing_date } = existingSubscriptionData?.[0] || {};

    const { error: subscriptionInsertionError, data: updatedSubscriptionData } =
      await supabase
        .from(SUBSCRIPTION_DB_NAME)
        .upsert({
          id,
          user_id: userId,
          product_id: productId,
          next_billing_date: getNextBillingDate(next_billing_date),
          environment: process.env.CUSTOM_NODE_ENV,
        })
        .select();

    if (subscriptionInsertionError) {
      logger.error(
        `Error while Adding subscription details: for user while inserting/updating subscription details: ${userId}`
      );
      throw new Error(subscriptionInsertionError?.message);
    }

    const { id: subscriptionId, next_billing_date: updatedNextBillingDate } =
      updatedSubscriptionData?.[0] || {};
    logger.info(
      `Adding payment details: for user while inserting/updating subscription details: User => ${userId} and subscription id => ${subscriptionId}`
    );

    const { error: paymentInsertionError, data: paymentData } = await supabase
      .from(PAYMENT_DB_NAME)
      .insert({
        user_id: userId,
        product_id: productId,
        subscription_id: subscriptionId,
        transaction_id: transactionId,
        amount,
        environment: process.env.CUSTOM_NODE_ENV,
      })
      .select();

    if (paymentInsertionError) {
      logger.error(
        `Error while Adding payment details: for user while inserting/updating payment details: user => ${userId} subscription id => ${subscriptionId}`
      );
      throw new Error(paymentInsertionError?.message);
    }

    res.status(StatusCodes.OK).send({
      subscriptionId: subscriptionId,
      paymentId: paymentData?.[0]?.id,
      nextBillingDate: dayjs(updatedNextBillingDate).format("LL"),
      error: null,
    });
    return;
  } catch (error) {
    logger.error(error);
    res.status(StatusCodes.BAD_REQUEST).send({
      subscriptionId: null,
      paymentId: null,
      nextBillingDate: null,
      error: "Subscription Addition Failed",
    });
    return;
  }
};
