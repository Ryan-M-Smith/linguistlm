"use client";

import Link from "next/link"
import { usePathname } from "next/navigation";

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
    <div className="relative flex shrink-0 h-16 items-center px-4">
      <div className="flex items-center mr-4 z-10">
        <AcmeLogo />
        <p className="ml-2"><b>LinguistLM</b></p>
      </div>

      {/* Center the nav items: absolute center of the navbar */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-6 z-0">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`transition-colors duration-300 font-medium ${
                isActive
                  ? "text-llm-sea-glass border-b-2 border-llm-sea-glass"
                  : "hover:text-llm-sea-glass"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}