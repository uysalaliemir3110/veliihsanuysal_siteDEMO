"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const links = [
  { href: "/", label: "Work" },
  { href: "/contact", label: "Contact" },
];

function NavContent({ toggleId }: { toggleId: string }) {
  const pathname = usePathname();

  function isLinkActive(href: string) {
    return href === "/"
      ? pathname === "/" || pathname.startsWith("/works")
      : pathname.startsWith(href);
  }

  return (
    <nav
      className="py-4 nav-inner"
      style={{ paddingLeft: "28px", paddingRight: "28px", position: "relative" }}
    >
      {/* Pure-CSS toggle: tapping the plus (a label) flips this checkbox */}
      <input type="checkbox" id={toggleId} className="nav-toggle-checkbox" />

      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="text-foreground text-[32px] md:text-[36px] tracking-[0.08em] uppercase font-bold leading-none"
        >
          Veli̇ İhsan Uysal
        </Link>

        <div className="flex items-center gap-10">
          {/* Desktop inline links — hidden on mobile via CSS */}
          {links.map((link) => {
            const isActive = isLinkActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-desktop-link text-[13px] md:text-[15px] tracking-[0.12em] uppercase font-bold transition-opacity duration-300 ${
                  isActive
                    ? "text-foreground opacity-100"
                    : "text-foreground opacity-25 hover:opacity-60"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Instagram — always visible */}
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

          {/* Mobile plus — a label that toggles the checkbox (no JS) */}
          <label
            htmlFor={toggleId}
            aria-label="Menu"
            className="nav-mobile-plus text-foreground opacity-100 hover:opacity-60 transition-opacity duration-300"
            style={{ padding: "6px" }}
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </label>
        </div>
      </div>

      {/* Mobile dropdown panel — full width below the bar, shown via CSS when checked */}
      <div className="nav-mobile-panel">
        {links.map((link) => {
          const isActive = isLinkActive(link.href);
          return (
            <a
              key={link.href}
              href={link.href}
              className={`block text-[16px] tracking-[0.12em] uppercase font-bold ${
                isActive ? "opacity-100" : "opacity-40"
              }`}
              style={{ padding: "16px 28px" }}
            >
              {link.label}
            </a>
          );
        })}
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
        <NavContent toggleId="nav-toggle-static" />
      </header>

      {sticky && (
        <header className="fixed top-0 left-0 right-0 z-50 animate-fade-up">
          <NavContent toggleId="nav-toggle-sticky" />
        </header>
      )}
    </>
  );
}
