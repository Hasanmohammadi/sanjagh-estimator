"use client";

import { Button } from "@skul/sanjagh-design-system/src/Design_Button";
import DesignTitle from "@skul/sanjagh-design-system/src/Design_Title";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState, type ReactNode } from "react";

export interface ConfirmModalProps {
  open: boolean;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  dir?: "rtl" | "ltr";
  closeOnBackdrop?: boolean;
}

const ANIMATION_DURATION = 200;

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "تایید",
  cancelLabel = "انصراف",
  onConfirm,
  onCancel,
  dir = "rtl",
  closeOnBackdrop = true,
}: ConfirmModalProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  const [shouldRender, setShouldRender] = useState(open);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (open) {
      setShouldRender(true);

      timeout = setTimeout(() => {
        setIsVisible(true);
      }, 10);
    } else {
      setIsVisible(false);

      timeout = setTimeout(() => {
        setShouldRender(false);
      }, ANIMATION_DURATION);
    }

    return () => clearTimeout(timeout);
  }, [open]);

  useEffect(() => {
    if (!shouldRender) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    if (open) {
      confirmRef.current?.focus();
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [shouldRender, open, onCancel]);

  if (!shouldRender || typeof document === "undefined") {
    return null;
  }

  const modal = (
    <div className="fixed inset-0 z-20 flex items-center justify-center p-4" role="presentation">
      <div
        aria-hidden="true"
        onClick={closeOnBackdrop ? onCancel : undefined}
        className={`
          absolute inset-0
          bg-design-gray-600
          backdrop-blur-[2px]
          transition-opacity duration-200
          ${isVisible ? "opacity-35" : "opacity-0"}
        `}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby={description ? "confirm-modal-desc" : undefined}
        dir={dir}
        className={`
          relative
          w-full
          max-w-md
          rounded-xl
          bg-design-white
          p-4
          shadow-xl
          transition-all
          duration-200
          ease-out
          ${isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"}
        `}
      >
        <div className="flex flex-col items-center text-center">
          <div id="confirm-modal-title" className="text-balance leading-relaxed">
            <DesignTitle sizeVariant="ThirdTitle" text={title} titleVariant="ThirdHeader" />
          </div>

          {description && (
            <div id="confirm-modal-desc" className="mt-3 text-pretty leading-relaxed text-muted-foreground">
              {description}
            </div>
          )}
        </div>

        <div className="mt-14 flex gap-3">
          <Button
            buttonVariant="PrimarySolidButton"
            contentVariant={{
              TAG: "Text",
              value: confirmLabel,
            }}
            heightVariant="LGButton"
            widthVariant="FixedWidthButton"
            onClick={onConfirm}
          />

          <Button
            buttonVariant="SecondaryGrayButton"
            contentVariant={{
              TAG: "Text",
              value: cancelLabel,
            }}
            heightVariant="LGButton"
            widthVariant="FixedWidthButton"
            onClick={onCancel}
          />
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
