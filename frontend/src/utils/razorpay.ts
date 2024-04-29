import { RAZOR_PAY_SDK_URL } from "./constant";

// for razorpay
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = RAZOR_PAY_SDK_URL;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};
