import { StatusCodes } from "http-status-codes";
import { supabase } from "../../dbClient.js";
import { getUserIdFromToken } from "../../utils/utils.js";
import { PAYMENT_DB_NAME } from "../../constant.js";
import logger from "../../utils/logger.js";

export const getPaymentHistory = async (req, res) => {
  logger.info("Fetching the recent payment history: Everything is OK");

  try {
    const userId = await getUserIdFromToken(req);
    if (!userId) {
      logger.error(`Fetched User Id: ${userId} - User not found`);
      throw new Error("User not found. Please try again");
    }

    const { data: paymentData, error: paymentError } = await supabase
      .from(PAYMENT_DB_NAME)
      .select(
        `
        id,
        created_at,
        transaction_id,
        amount,
        products (
          name
        ),
        subscriptions (
          next_billing_date
        )
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (paymentError) {
      logger.error("Fetching Payment History Failed: " + paymentError?.message);
      throw new Error(
        "Fetching Payment History Failed: " + paymentError?.message
      );
    }

    const formattedPayments = paymentData.map((payment) => ({
      paymentId: payment.id,
      paymentDate: payment.created_at,
      transactionId: payment.transaction_id,
      productName: payment.products?.name,
      nextBillingDate: payment.subscriptions?.next_billing_date,
    }));

    res.status(StatusCodes.OK).send({
      payments: formattedPayments,
      error: null,
    });
  } catch (error) {
    logger.error("Failed to fetch payment history: " + error?.message);
    res.status(StatusCodes.BAD_REQUEST).send({
      payments: [],
      error: "Fetching Payment History Failed: " + error?.message,
    });
  }
  return;
};
