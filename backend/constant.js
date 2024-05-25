export const USER_AUTHORIZATION_API = "/api/authorize/";

export const STUDENT_DETAILS_API = "/api/student/";

export const SUBSCRIPTION_DETAILS_API = "/api/subscriptions/";

export const MIGRATIONS_API = "/api/migrations/";
export const PROFILE_DB_NAME = "profiles";
export const RESULTS_DB_NAME = "results";
export const PASSAGE_DB_NAME = "passages";
export const PRODUCT_DB_NAME = "products";
export const SUBSCRIPTION_DB_NAME = "subscriptions";
export const PAYMENT_DB_NAME = "payments";

export const FEATURE_DETAILS = {
  FREE: {
    features: [
      { text: "10 passages of Both languages", correct: true },
      { text: "3 mock test of both Marathi", correct: true},
      { text: "Daily progress tracking", correct: true },
      { text: "Result based on first 1500 keystroke", correct: true},
      { text: "Keystroke and Accuracy count", correct: true },
      { text: "3 mock test of both languages", correct: true},
      { text: "Weekly progress tracking", correct: false },
      { text: "Monthly progress tracking", correct: false},


    ],
  },
  STANDARD_MARATHI: {
    features: [
      { text: "100+ passages of Marathi", correct: true },
      { text: "25 + mock test of both Marathi", correct: true},
      { text: "Result based on first 1500 keystroke", correct: true},
      { text: "Daily progress tracking", correct: true },
      { text: "Keystroke and Accuracy count", correct: true },
      { text: "Weekly progress tracking", correct: true },
      { text: "Monthly progress tracking", correct: true },
    ],
  },
  STANDARD_ENGLISH: {
    features: [
      { text: "100+ passages of English", correct: true },
      { text: "25 + mock test of both English", correct: true},
      { text: "Result based on first 1500 keystroke", correct: true},
      { text: "Daily progress tracking", correct: true },
      { text: "Keystroke and Accuracy count", correct: true },
      { text: "Weekly progress tracking", correct: true },
      { text: "Monthly progress tracking", correct: true },
    ],
  },
  PREMIUM: {
    features: [
      { text: "100+ passages of Both Languages", correct: true },
      { text: "25 + mock test of both languages", correct: true},
      { text: "Result based on first 1500 keystroke", correct: true},
      { text: "Daily progress tracking", correct: true },
      { text: "Keystroke and Accuracy count", correct: true },
      { text: "Weekly progress tracking", correct: true },
      { text: "Monthly progress tracking", correct: true },
    ],
  },
};
