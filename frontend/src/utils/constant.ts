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
    title: "Subscription",
    href: "/payment",
    icon: "Payment",
    label: "Payment",
  },
  /*{
    title: "Leader Board",
    href: "/leader-board",
    icon: "LeaderBoard",
    label: "Leader Board",
  }, */
];
