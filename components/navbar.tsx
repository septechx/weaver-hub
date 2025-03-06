"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";

const items: { name: string; href: string }[] = [
  { name: "Weaves", href: "/weaves" },
];

export function NavBar() {
  const path = usePathname();

  return (
    <>
      <div className="bg-primary-foreground grid min-w-full grid-cols-3 grid-rows-1 items-center px-4 py-2">
        <div className="relative w-fit">
          <Link href="/">
            <Logo fill="var(--heavy-accent)" height={48} width={96} />
          </Link>
          {path === "/" && (
            <motion.div
              className="bg-accent-foreground absolute inset-x-0 bottom-[-9px] h-[2px]"
              layoutId="underline"
              transition={{ ease: "easeInOut" }}
            />
          )}
        </div>
        <div className="flex justify-center">
          <NavigationMenu>
            <NavigationMenuList className="gap-4">
              {items.map((item, i) => (
                <div key={i}>
                  <NavigationMenuItem>
                    <Link href={item.href} legacyBehavior passHref>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        {item.name}
                      </NavigationMenuLink>
                    </Link>
                    {path === item.href && (
                      <motion.div
                        className="bg-accent-foreground absolute inset-x-0 bottom-[-15px] h-[2px]"
                        layoutId="underline"
                        transition={{ ease: "easeInOut" }}
                      />
                    )}
                  </NavigationMenuItem>
                </div>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex justify-end">
          <ThemeToggle />
        </div>
      </div>
      <div className="bg-accent h-[1px] w-full" />
    </>
  );
}
