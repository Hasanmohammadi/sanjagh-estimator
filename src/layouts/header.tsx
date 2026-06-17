import { useMatches, useNavigate } from "react-router-dom";
import { BackRightIcon } from "../assets/icons";
import { useEffect } from "react";

import { DesignTitle } from "@skul/sanjagh-design-system/src/Design_Title";

interface RouteHandle {
  title?: string;
}

export default function Header() {
  const navigate = useNavigate();

  const matches = useMatches();
  const title = (matches[matches.length - 1]?.handle as RouteHandle | undefined)?.title ?? "محاسبه قیمت";

  useEffect(() => {
    if (title) {
      document.title = `${title} | سنجاق`;
    }
  }, [title]);

  return (
    <header className="relative flex items-center justify-center">
      <button className="absolute right-4" onClick={() => navigate(-1)}>
        <BackRightIcon />
      </button>

      <DesignTitle sizeVariant="FirstTitle" text={title} titleVariant="Body" />
    </header>
  );
}
