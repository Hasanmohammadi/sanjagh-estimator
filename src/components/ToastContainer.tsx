"use client";

import { useEffect, useRef, useState } from "react";
import { dismiss, toastEmitter, type ToastItem, type ToastType } from "../utils/toast";

// ── styles ────────────────────────────────────────────────────────────────────

const COLORS: Record<ToastType, { bg: string; border: string; text: string; icon: string }> = {
  success: { bg: "#f0fdf4", border: "#86efac", text: "#166534", icon: "✓" },
  error: { bg: "#fef2f2", border: "#fca5a5", text: "#991b1b", icon: "✕" },
  warning: { bg: "#fffbeb", border: "#fcd34d", text: "#92400e", icon: "!" },
  info: { bg: "#eff6ff", border: "#93c5fd", text: "#1e40af", icon: "i" },
};

const CONTAINER_ID = "toast-container-root";

const responsiveCSS = `
  #${CONTAINER_ID} {
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    z-index: 9999;
    pointer-events: none;
  }

  @media (max-width: 640px) {
    #${CONTAINER_ID} {
      right: 50%;
      transform: translateX(50%);
      bottom: 1.25rem;
      width: calc(100vw - 2rem);
      align-items: center;
    }
  }
`;

// ── single toast ──────────────────────────────────────────────────────────────

interface ToastProps {
  item: ToastItem;
  onDismiss: (id: string) => void;
}

function Toast({ item, onDismiss }: ToastProps) {
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const c = COLORS[item.type];

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // entrance animation
  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // exit animation just before the item is actually removed
  useEffect(() => {
    timerRef.current = setTimeout(() => setVisible(false), item.duration - 300);
    return () => clearTimeout(timerRef.current);
  }, [item.duration]);

  const slideHidden = isMobile ? "translateY(120%)" : "translateX(110%)";
  const slideVisible = isMobile ? "translateY(0)" : "translateX(0)";

  const toastStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "0.625rem",
    width: isMobile ? "100%" : undefined,
    minWidth: isMobile ? undefined : "260px",
    maxWidth: isMobile ? undefined : "360px",
    padding: "0.75rem 1rem",
    borderRadius: "0.5rem",
    border: `1px solid ${c.border}`,
    background: c.bg,
    color: c.text,
    fontSize: "0.875rem",
    lineHeight: "1.5",
    boxShadow: "0 4px 12px rgba(0,0,0,0.10)",
    pointerEvents: "all",
    cursor: "default",
    transform: visible ? slideVisible : slideHidden,
    opacity: visible ? 1 : 0,
    transition: "transform 0.28s ease, opacity 0.28s ease",
  };

  const iconStyle: React.CSSProperties = {
    flexShrink: 0,
    width: "1.25rem",
    height: "1.25rem",
    borderRadius: "50%",
    border: `1.5px solid ${c.border}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: "0.7rem",
    lineHeight: 1,
    color: c.text,
  };

  const closeStyle: React.CSSProperties = {
    marginLeft: "auto",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: c.text,
    opacity: 0.5,
    padding: "0 0.1rem",
    fontSize: "1rem",
    lineHeight: 1,
    display: "flex",
    alignItems: "center",
  };

  return (
    <div role="alert" aria-live="polite" style={toastStyle}>
      <span style={iconStyle} aria-hidden="true">
        {c.icon}
      </span>
      <span style={{ flex: 1 }}>{item.message}</span>
      <button style={closeStyle} aria-label="Dismiss notification" onClick={() => onDismiss(item.id)}>
        ×
      </button>
    </div>
  );
}

// ── container ─────────────────────────────────────────────────────────────────

export default function ToastContainer() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    return toastEmitter.subscribe(setItems);
  }, []);

  if (items.length === 0) return null;

  return (
    <>
      <style>{responsiveCSS}</style>
      <div id={CONTAINER_ID} aria-label="Notifications">
        {items.map(item => (
          <Toast key={item.id} item={item} onDismiss={dismiss} />
        ))}
      </div>
    </>
  );
}
