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
  /*   {
    title: "Payment",
    href: "/payment-history",
    icon: "Payment",
    label: "Payment History",
  },
  {
    title: "Leader Board",
    href: "/leader-board",
    icon: "LeaderBoard",
    label: "Leader Board",
  }, */
];
