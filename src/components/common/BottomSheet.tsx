import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export default function BottomSheet({ open, onClose, children }: BottomSheetProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  return createPortal(
    <>
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300
          ${open ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
        onClick={onClose}
      />

      <div
        className={`
          fixed bottom-0 left-0 right-0 z-50
          rounded-t-3xl bg-white shadow-lg
          transition-transform duration-300 ease-out
          ${open ? "translate-y-0" : "translate-y-full"}
        `}
      >
        <div className="flex justify-center py-3">
          <div className="h-1.5 w-12 rounded-full bg-gray-300" />
        </div>

        <div className="max-h-[80vh] overflow-y-auto p-4">{children}</div>
      </div>
    </>,
    document.body,
  );
}
