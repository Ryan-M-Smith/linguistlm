"use client";

import Link from "next/link"
import Image from "next/image";
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
    <div className="bg-llm-lace dark:bg-default-50 relative flex shrink-0 h-16 items-center pl-2 pr-4">
      <div className="flex items-center z-10 gap-2 justify-center">
        <Link href="/">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 15 460 90" className="w-[200px] h-auto">
            <defs>
              <style>
                {`
                  @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@700&display=swap');
                  
                  .logo-text {
                    font-family: 'Rubik', sans-serif;
                    font-weight: 700;
                  }
                `}
              </style>
            </defs>
            
            {/* Main Logo Text */}
            <text x="10" y="80" className="logo-text" fontSize="72">
              <tspan className="fill-[#77C5C5]">L</tspan>
              <tspan className="fill-default-400">INGUIST</tspan>
            </text>
            
            {/* Chat Bubble with LM */}
            <g transform="translate(360, 25)">
              {/* Bubble shape */}
              <rect className="fill-[#77C5C5]" x="0" y="0" width="90" height="60" rx="12"/>
              {/* Chat tail */}
              <path className="fill-[#77C5C5]" d="M 15 60 L 10 70 L 25 60 Z"/>
              {/* LM text */}
              <text x="45" y="33" className="logo-text fill-default-50" fontSize="32" textAnchor="middle" dominantBaseline="middle">LM</text>
            </g>
          </svg>
        </Link>
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