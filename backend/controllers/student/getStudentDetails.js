import { StatusCodes } from "http-status-codes";
import { supabase } from "../../dbClient.js";
import { PROFILE_DB_NAME } from "../../constant.js";
import { getUserIdFromToken } from "../../utils/utils.js";
import { shouldHaveLimitedAccess } from "../../utils/subscriptionUtils.js";
import logger from "../../utils/logger.js";

export const getStudentDetails = async (req, res) => {
	try {
		const userId = await getUserIdFromToken(req);
		if (!userId) {
			throw new Error("User not found. Please try again");
		}

		const { data: profileData, error: profileError } = await supabase
			.from(PROFILE_DB_NAME)
			.select(
				`
     				name,
    				user_type
    			`
			)
			.eq("user_id", userId);

		if (profileError) {
			throw new Error(profileError?.message);
		}

		const { name, user_type: type } = profileData?.[0] || {};

		if (!name || !type) {
			throw new Error("missing key details");
		}

		const isLimitedAccessForMarathi = await shouldHaveLimitedAccess(
			userId,
			"MARATHI"
		);

		const isLimitedAccessForEnglish = await shouldHaveLimitedAccess(
			userId,
			"MARATHI"
		);

		res.status(StatusCodes.OK).send({
			user: {
				name,
				userId,
				type,
				isLimitedAccessForMarathi,
				isLimitedAccessForEnglish,
			},
			error: null,
		});
		return;
	} catch (error) {
		logger.error(error);
		res
			.status(StatusCodes.BAD_REQUEST)
			.send({ user: null, error: "User not found. Please try again" });
		return;
	}
};
