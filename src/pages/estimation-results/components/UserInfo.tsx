import { Card } from "@skul/sanjagh-design-system/src/Design_Card";
import { TextField } from "@skul/sanjagh-design-system/src/Design_TextField";
import DesignTitle from "@skul/sanjagh-design-system/src/Design_Title";

export default function UserInfo() {
  return (
    <Card
      children={
        <>
          <DesignTitle sizeVariant="ThirdTitle" text="اطلاعات مشتری" titleVariant="Body" color="BlackMain" />
          <DesignTitle sizeVariant="SmallBody" text="نام مشتری" titleVariant="Body" color="BlackMain" />
          <TextField
            backgroundVariant="Outlined"
            heightVariant="MDTextField"
            onTextChanged={() => {}}
            value=""
            className="mt-2 border border-design-gray-200"
          />
          <div className="mt-3">
            <DesignTitle sizeVariant="SmallBody" text="سایر توضیحات" titleVariant="Body" color="BlackMain" />
            <TextField
              backgroundVariant="Outlined"
              heightVariant="MDTextField"
              onTextChanged={() => {}}
              value=""
              className="mt-2 border border-design-gray-200"
              placeholder="توضیحات خود درباره جزییات رنگ آمیزی را اینجا بنویسید."
            />
          </div>
        </>
      }
      extraClassName="border-3 border-design-gray-200 mt-2"
      shadow="NoShadow"
      variant="SM"
    />
  );
}
