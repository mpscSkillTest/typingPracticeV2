import { PROFILE_DB_NAME } from "../../constant.js";
import { supabase } from "../../dbClient.js";
import logger from "../../utils/logger.js";

export const oauthSignin = async (req, res) => {
    const { email, name, supabase_uid, phone } = req.body;
    logger.info(
        "Signing up new user via google with data:",
        JSON.stringify(req?.body || {})
    );
    try {
        // Check if user exists
        const { data: existingUser, error: findError } = await supabase
            .from(PROFILE_DB_NAME)
            .select('*')
            .eq('email', email)
            .single();

        if (findError && findError.code !== 'PGRST116') {
            throw findError;
        }

        if (!existingUser) {
            // Insert new user
            const { data: insertedUser, error: insertError } = await supabase
                .from(PROFILE_DB_NAME)
                .insert([{
                    email,
                    name: name,
                    user_id: supabase_uid,
                    contact_number: phone || null,
                    user_type: "STUDENT",
                    updated_at: new Date().toISOString(),
                }]);

            if (insertError) {
                throw insertError;
            }

            logger.info(`New OAuth user inserted: ${email}`);
        } else {
            logger.info(`OAuth user already exists: ${email}`);
        }

        res.status(200).json({ success: true });

    } catch (error) {
        logger.error("OAuth Signin Error:", error.message || error.stack);
        res.status(500).json({ error: error.message || "Internal server error" });
    }
};
