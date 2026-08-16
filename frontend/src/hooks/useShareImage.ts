import { useCallback, useState } from "react";
import { toPng } from "html-to-image";

interface UseShareImageOptions {
  fileName?: string;
  title?: string;
  text?: string;
  pixelRatio?: number;
  backgroundColor?: string;
}

export function useShareImage(options: UseShareImageOptions = {}) {
  const { fileName = "image.png", title = "", text = "", pixelRatio = 2, backgroundColor = "#ffffff" } = options;

  const [isSharing, setIsSharing] = useState(false);

  const waitForImages = useCallback(async (element: HTMLElement) => {
    const images = Array.from(element.querySelectorAll("img"));

    await Promise.all(
      images.map(
        img =>
          new Promise<void>(resolve => {
            if (img.complete && img.naturalWidth > 0) {
              resolve();
              return;
            }

            img.onload = () => resolve();
            img.onerror = () => resolve();
          }),
      ),
    );
  }, []);

  const shareImage = useCallback(
    async (element: HTMLElement | null) => {
      if (!element || isSharing) return;

      try {
        setIsSharing(true);

        // Wait for all images
        await waitForImages(element);

        // Wait for browser layout/paint
        await new Promise(resolve => requestAnimationFrame(resolve));

        const dataUrl = await toPng(element, {
          pixelRatio,
          cacheBust: true,
          backgroundColor,
          width: element.scrollWidth,
          height: element.scrollHeight,
        });

        const response = await fetch(dataUrl);

        const blob = await response.blob();

        const file = new File([blob], fileName, {
          type: "image/png",
        });

        // Native share
        if (
          typeof navigator.share === "function" &&
          typeof navigator.canShare === "function" &&
          navigator.canShare({
            files: [file],
          })
        ) {
          await navigator.share({
            title,
            text,
            files: [file],
          });

          return;
        }

        // Fallback: Download image
        const link = document.createElement("a");

        link.download = fileName;
        link.href = dataUrl;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
      } catch (error) {
        // User closed share sheet
        if ((error as DOMException)?.name !== "AbortError") {
          console.error("Share image failed:", error);
        }
      } finally {
        setIsSharing(false);
      }
    },
    [backgroundColor, fileName, isSharing, pixelRatio, text, title, waitForImages],
  );

  return {
    shareImage,
    isSharing,
  };
}
