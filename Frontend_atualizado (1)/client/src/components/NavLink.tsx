import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  className?: string;
  activeClassName?: string;
  children: React.ReactNode;
  [key: string]: any;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ className, activeClassName, href, children, ...props }, ref) => {
    return (
      <a
        ref={ref}
        href={href}
        className={cn(className)}
        {...props}
      >
        {children}
      </a>
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
