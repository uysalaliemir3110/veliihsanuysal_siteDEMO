"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const links = [
  { href: "/", label: "Work" },
  { href: "/contact", label: "Contact" },
];

function NavContent() {
  const pathname = usePathname();

  return (
    <nav style={{ paddingLeft: "28px", paddingRight: "28px" }} className="py-4">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="text-foreground text-[32px] md:text-[36px] tracking-[0.08em] uppercase font-bold leading-none"
        >
          Veli̇ İhsan Uysal
        </Link>
        <div className="flex items-center gap-10">
          {links.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/" || pathname.startsWith("/works")
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[13px] md:text-[15px] tracking-[0.12em] uppercase font-bold transition-opacity duration-300 ${
                  isActive
                    ? "text-foreground opacity-100"
                    : "text-foreground opacity-25 hover:opacity-60"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <a
            href="https://instagram.com/veliihsanuysalphotography"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-foreground opacity-100 hover:opacity-60 transition-opacity duration-300"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
        </div>
      </div>
    </nav>
  );
}

export default function Nav() {
  const headerRef = useRef<HTMLElement>(null);
  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const observer = new IntersectionObserver(
      ([entry]) => setSticky(!entry.isIntersecting),
      { threshold: 0 }
    );

    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        style={{ marginTop: "8px", marginBottom: "8px" }}
        className={sticky ? "invisible" : ""}
      >
        <NavContent />
      </header>

      {sticky && (
        <header className="fixed top-0 left-0 right-0 z-50 animate-fade-up">
          <NavContent />
        </header>
      )}
    </>
  );
}
