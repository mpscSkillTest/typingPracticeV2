import { navItems } from "../../utils/constant";
import { usePathname } from "../../utils/hooks";
import type { NavItem } from "../../types";
import Heading from "./heading";

const getMatchedPath = (pathname: string) => {
  const matchedPath =
    navItems.find((item: NavItem) => item.href === pathname) ||
    navItems.find(
      (item: NavItem) =>
        pathname.startsWith(item.href + "/") && item.href !== "/"
    );
  return matchedPath?.title || "";
};

export default function Header() {
  const pathname = usePathname();
  const headingText = getMatchedPath(pathname);

  return (
    <div className="flex flex-1 items-center justify-between bg-secondary px-4">
      <Heading title={headingText} />
      <div className="ml-4 flex items-center md:ml-6"></div>
    </div>
  );
}
