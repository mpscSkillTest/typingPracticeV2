import dayjs from "dayjs";
import { supabase } from "../../dbClient.js";
import {
  SUBSCRIPTION_DB_NAME,
  PAYMENT_DB_NAME,
  PROFILE_DB_NAME,
} from "../../constant.js";
import { getNextBillingDate } from "../../utils/getNextBillingDate.js";
import UserTypeEnum from "../../enums/UserTypeEnum.js";
// import users from "./Institute-Data/nashik 2nd mock test-list.js";
// import users from "./Institute-Data/29th June Mock Test Mahesh Computer.js";
//import users from "./Institute-Data/26th June Mock Test Mahesh Computer.js";
// import users from "./Institute-Data/Nashik-institute-list.js";
// import users from "./Institute-Data/MPSC CANDIDATE Nagpur 2.js";
// import users from "./Institute-Data/Amravati-inst-04.js";
// import users from "./Institute-Data/amravati-istitute-2nd-list.js";

// pay_maheshmock5
// 105
const users = [];
const transactionId = "";
const institute_id = null;

export const addUserWithMonthlySubscriptions = async (req, res) => {
  if (!users?.length || !transactionId || !institute_id) {
    return;
  }

  const validUsers = [];
  const invalidUsers = [];

  for (let index = 0; index < users.length; index++) {
    const userDetails = users[index] || {};
    const { email, password, name, contactNumber, productId, amount } =
      userDetails;

    if (!email || !password || !productId) {
      console.log("invalid user creating");
      invalidUsers.push({
        ...userDetails,
      });
      continue;
    }

    console.log("creating user", email, name);

    // new user signup
    const { data: newUserData, error: newUserError } =
      await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            email: email.trim(),
            name,
            contactNumber: contactNumber || 1234567890,
            type: UserTypeEnum.STUDENT.name,
            institute_id,
          },
        },
      });

    let userId = newUserData?.user?.id;

    if (!userId || newUserError) {
      // use following code block only for existing users
      const { error: profileError, data: profileData } = await supabase
        .from(PROFILE_DB_NAME)
        .select(
          `
        user_id
      `
        )
        .eq("email", email);

      userId = profileData?.[0]?.user_id;

      if (!userId || profileError) {
        console.log("error in creating user", email, name);
        console.log(profileError);
        invalidUsers.push({
          ...userDetails,
        });
        continue;
      }
    }

    const { error: profileUpdateError, data: profileUpdateData } =
      await supabase
        .from(PROFILE_DB_NAME)
        .update({
          institute_id,
        })
        .eq("user_id", userId);

    const { error: subscriptionInsertionError, data: updatedSubscriptionData } =
      await supabase
        .from(SUBSCRIPTION_DB_NAME)
        .upsert({
          id: undefined,
          user_id: userId,
          product_id: productId,
          next_billing_date: getNextBillingDate(),
          environment: "production",
        })
        .select();

    const subscriptionId = updatedSubscriptionData?.[0]?.id;

    if (!subscriptionId || subscriptionInsertionError) {
      console.log("error in adding subscription for user");
      console.log(subscriptionInsertionError);
      invalidUsers.push({
        ...userDetails,
        userId,
      });
      continue;
    }

    const { error: paymentInsertionError, data: paymentData } = await supabase
      .from(PAYMENT_DB_NAME)
      .insert({
        user_id: userId,
        product_id: productId,
        subscription_id: subscriptionId,
        transaction_id: transactionId,
        amount,
        environment: "production",
        institute_id,
      })
      .select();

    const paymentId = paymentData?.[0]?.id;

    if (!paymentId || paymentInsertionError) {
      console.log("error in adding payment for user");
      console.log(paymentInsertionError);
      invalidUsers.push({
        ...userDetails,
        userId,
        subscriptionId,
      });
      continue;
    }

    validUsers.push({
      ...userDetails,
      userId,
      subscriptionId,
      paymentId,
    });

    console.log("user creating complete", email, name);
  }

  res.status(200).send({
    success: true,
    validUsers,
    invalidUsers,
  });
};
