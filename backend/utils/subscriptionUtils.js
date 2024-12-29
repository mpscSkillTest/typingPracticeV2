import dayjs from "dayjs";
import { supabase } from "../dbClient.js";
import { SUBSCRIPTION_DB_NAME } from "../constant.js";
import logger from "./logger.js";

export const getActiveUserSubscriptions = async (userId) => {
	logger.info(
		`Checking the subscription details for user ${userId}: Everything is OK`
	);

	const today = dayjs().format("YYYY-MM-DD");

	const { data: subscriptions, error: subscriptionErrors } = await supabase
		.from(SUBSCRIPTION_DB_NAME)
		.select(
			`
      products (product_type)
`
		)
		.eq("user_id", userId)
		.gte("next_billing_date", today);

	let activeSubscriptions = new Set();

	if (subscriptionErrors) {
		logger.error(`Fetching the subscription details failed for user ${userId}`);
	} else {
		subscriptions?.forEach?.((subscription) => {
			activeSubscriptions.add(subscription?.products?.product_type);
		});
	}
	return activeSubscriptions;
};

export const shouldHaveLimitedAccess = async (userId, subject) => {
	const activeSubscriptions = await getActiveUserSubscriptions(userId);

	let shouldHaveLimitedAccess = true;

	if (activeSubscriptions.has("PREMIUM")) {
		shouldHaveLimitedAccess = false;
	} else if (
		subject === "MARATHI" &&
		activeSubscriptions.has("STANDARD_MARATHI")
	) {
		shouldHaveLimitedAccess = false;
	} else if (
		subject === "ENGLISH" &&
		activeSubscriptions.has("STANDARD_ENGLISH")
	) {
		shouldHaveLimitedAccess = false;
	}
	return shouldHaveLimitedAccess;
};
