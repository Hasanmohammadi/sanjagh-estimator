import { useEffect, useRef, useState, type TouchEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";

type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

const CLOSE_THRESHOLD = 50;

export default function BottomSheet({ open, onClose, children }: BottomSheetProps) {
  const [dragOffset, setDragOffset] = useState(0);

  const contentRef = useRef<HTMLDivElement>(null);

  const startY = useRef(0);
  const dragging = useRef(false);
  const draggingSheet = useRef(false);

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

  useEffect(() => {
    if (!open) {
      setDragOffset(0);
      dragging.current = false;
      draggingSheet.current = false;
    }
  }, [open]);

  /*
   * شروع gesture از handle
   */
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (!open) return;

    startY.current = e.touches[0].clientY;

    dragging.current = true;
    draggingSheet.current = true;
  };

  /*
   * شروع gesture از content
   */
  const handleContentTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (!open) return;

    const content = contentRef.current;

    if (!content) return;

    startY.current = e.touches[0].clientY;

    dragging.current = true;

    /*
     * فقط وقتی content در بالاترین نقطه است
     * و کاربر می‌تواند Sheet را پایین بکشد.
     */
    draggingSheet.current = content.scrollTop <= 0;
  };

  /*
   * حرکت انگشت
   */
  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!dragging.current) return;

    const currentY = e.touches[0].clientY;

    const deltaY = currentY - startY.current;

    /*
     * اگر gesture از content شروع شده
     * ولی content اسکرول شده، اجازه بده
     * خود content کار خودش را بکند.
     */
    if (!draggingSheet.current) {
      return;
    }

    /*
     * فقط حرکت به پایین
     */
    if (deltaY <= 0) {
      setDragOffset(0);
      return;
    }

    /*
     * اینجا جلوی scroll شدن content را می‌گیریم
     * چون الان داریم Sheet را drag می‌کنیم.
     */
    e.preventDefault();

    setDragOffset(deltaY);
  };

  /*
   * پایان gesture
   */
  const handleTouchEnd = () => {
    if (!dragging.current) return;

    dragging.current = false;

    if (!draggingSheet.current) {
      return;
    }

    draggingSheet.current = false;

    /*
     * اگر به اندازه کافی پایین کشیده شده
     */
    if (dragOffset >= CLOSE_THRESHOLD) {
      setDragOffset(0);
      onClose();
      return;
    }

    /*
     * اگر کافی نبود، برگردد سر جای خودش
     */
    setDragOffset(0);
  };

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        className={`fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-white shadow-lg ${
          dragOffset === 0 ? "transition-transform duration-300 ease-out" : ""
        }`}
        style={{
          transform: open ? `translateY(${dragOffset}px)` : "translateY(100%)",
        }}
      >
        {/* Handle */}
        <div
          className="flex cursor-grab justify-center py-3 touch-none active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
          <div className="h-1.5 w-12 rounded-full bg-gray-300" />
        </div>

        {/* Content */}
        <div
          ref={contentRef}
          className="max-h-[80vh] overflow-y-auto p-4 pt-0"
          onTouchStart={handleContentTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          style={{
            overscrollBehavior: "contain",
          }}
        >
          {children}
        </div>
      </div>
    </>,
    document.body,
  );
}
