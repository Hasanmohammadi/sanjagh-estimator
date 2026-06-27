import { Button } from "@skul/sanjagh-design-system/src/Design_Button";

interface Item {
  title: string;
  value: string;
}

interface Props {
  list: Item[];
  value?: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function ButtonList({ list, value, onChange, className }: Props) {
  return (
    <div className={className}>
      {list.map(item => (
        <Button
          key={item.value}
          buttonVariant={item.value === value ? "PrimarySolidButton" : "SecondaryGrayButton"}
          contentVariant={{
            TAG: "Text",
            value: item.title,
          }}
          heightVariant="LGButton"
          widthVariant="FixedWidthButton"
          onClick={() => onChange(item.value)}
        />
      ))}
    </div>
  );
}
