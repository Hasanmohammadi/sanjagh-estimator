import { Button } from "@skul/sanjagh-design-system/src/Design_Button";
import { useEffect, useState } from "react";

interface Item {
  title: string;
  value: string;
}

interface Props {
  list: Item[];
  onChange: (value: string | undefined) => void;
  className?: string;
  defaultValue?: string;
}

export default function ButtonList({ list, onChange, className, defaultValue }: Props) {
  const [activeButton, setActiveButton] = useState<string | undefined>(defaultValue);

  useEffect(() => {
    onChange(activeButton);
  }, [activeButton]);

  return (
    <div className={className}>
      {list.map(({ title, value }) => (
        <Button
          key={value}
          buttonVariant={value === activeButton ? "PrimarySolidButton" : "SecondaryGrayButton"}
          contentVariant={{ TAG: "Text", value: title }}
          heightVariant="LGButton"
          widthVariant="FixedWidthButton"
          onClick={() => setActiveButton(value)}
        />
      ))}
    </div>
  );
}
