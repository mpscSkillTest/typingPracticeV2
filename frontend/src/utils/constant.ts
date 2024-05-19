export const AUTH_TOKEN_KEY = "access_token";

export type NavItem = Record<string, string>;

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: "dashboard",
    label: "Dashboard",
  },
  {
    title: "Practice",
    href: "/practice",
    icon: "Practice",
    label: "Practice",
  },
  {
    title: "Speed Test",
    href: "/speed-test",
    icon: "SpeedTest",
    label: "Speed Test",
  },
  {
    title: "Mock Tests",
    href: "/mock-test",
    icon: "MockTest",
    label: "Mock Tests",
  },
  {
    title: "Subscriptions",
    href: "/subscription",
    icon: "Payment",
    label: "Subscription",
  },
  {
    title: "Transactions",
    href: "/transaction",
    icon: "IndianRupee",
    label: "Transactions",
  },
];

export const COMPANY_URL =
  "https://webtouter.com/wp-content/uploads/elementor/thumbs/51-removebg-preview-e1698666812110-qemezppy9czl6ops5j8wvxrcupi8wegb87uwfo6qkg.png";

export const RAZOR_PAY_SDK_URL = "https://checkout.razorpay.com/v1/checkout.js";
