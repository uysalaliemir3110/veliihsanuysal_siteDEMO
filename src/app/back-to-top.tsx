"use client";

import { useEffect, useState } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <a
      href="#top"
      style={{
        position: "fixed",
        bottom: "32px",
        right: "32px",
        zIndex: 50,
        background: "transparent",
        fontSize: "13px",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        fontWeight: 700,
        color: "var(--color-foreground)",
        opacity: 1,
        transition: "opacity 0.3s",
        textDecoration: "none",
      }}
    >
      Back to top
    </a>
  );
}
