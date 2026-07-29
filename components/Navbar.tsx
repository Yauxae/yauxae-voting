"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-burgundy-950/90 backdrop-blur-md">
      <div className="flex items-center justify-between px-5 py-4">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="font-display text-xl font-semibold tracking-widest2 text-gradient-gold">
            YAUXAÉ
          </span>
        </Link>

        <nav className="flex items-center gap-1 rounded-full border border-burgundy-700/70 bg-burgundy-900/60 p-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  active
                    ? "bg-gold-500 text-burgundy-950"
                    : "text-bone/70 hover:text-gold-300"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="leopard-rule mx-5 opacity-80" />
    </header>
  );
}
