"use client";

import {Navbar, NavbarBrand, NavbarContent, NavbarItem} from "@heroui/navbar";
import {Button} from "@heroui/button";
import {Link} from "@heroui/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import path from "path";

export const AcmeLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export default function App() {
  const pathname = usePathname();
  const navItems = [
    { name: "Home", href: "/" },
    { name: "Read", href: "/read" },
    { name: "Write", href: "/write" },
    { name: "Speak", href: "/speak" },
    { name: "About", href: "/about" }
  ]

  return (
    <div className="flex items-center justify-center">
      <Navbar className="bg-llm-masala">
        <NavbarBrand>
          <AcmeLogo />
          <p className="font-bold text-llm-sea-glass">ACME</p>
        </NavbarBrand>
        <NavbarContent>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <NavbarItem key={item.href} isActive={isActive}>
              <Link
                href={item.href}
                className={`transition-colors duration-300 font-medium ${
                  isActive
                    ? "text-llm-sea-glass border-b-2 border-llm-sea-glass"
                    : "text-llm-lace hover:text-llm-sea-glass"
                }`}
              >
                {item.name}
              </Link>
            </NavbarItem>
          );
        })}
      </NavbarContent>
      </Navbar>
    </div>
  );
}