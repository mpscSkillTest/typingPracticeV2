import { useState } from "react";
import { Icons } from "@/components/ui/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { navItems } from "../../utils/constant";
import { usePathname } from "../../utils/hooks";
import type { NavItem } from "../../types";
import Heading from "./heading";
import ContactForm from "./contact-form";

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
  const [shouldShowContactUsModal, setShouldShowContactUsModal] =
    useState<boolean>(false);

  const toggleContactUsDom = () => {
    setShouldShowContactUsModal((prevShowFlag) => !prevShowFlag);
  };

  const getContactUsDom = () => {
    if (!shouldShowContactUsModal) {
      return null;
    }
    return (
      <ContactForm
        shouldOpen={shouldShowContactUsModal}
        toggleOpen={toggleContactUsDom}
      />
    );
  };

  const getHelpIconDom = () => {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Icons.HelpIcon
              className="cursor-pointer mr-2 inline-block"
              onClick={toggleContactUsDom}
            />
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Contact Us</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <>
      <div className="flex flex-1 items-center justify-between bg-secondary px-4">
        <Heading title={headingText} />
        <div className="ml-4 flex items-center md:ml-6">{getHelpIconDom()}</div>
      </div>
      {getContactUsDom()}
    </>
  );
}
