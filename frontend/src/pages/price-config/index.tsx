import { PricingForm } from "./PricingForm";

export default function PriceConfig() {
  // const [configType, setConfigType] = useState<"sanjagh" | "custom">("sanjagh");
  return (
    <>
      {/* <div className="mr-5 my-2">
        <DesignTitle sizeVariant="ThirdTitle" text="نحوه تعیین قیمت" titleVariant="ThirdHeader" color="BlackMain" />
      </div> */}

      {/* <RadioButton
        checked={configType === "sanjagh"}
        label="استفاده از جدول قیمت من در سنجاق"
        onCheckedChange={() => setConfigType("sanjagh")}
        value="sanjagh"
        size="LargeRadioButton"
      />
      <RadioButton
        checked={configType === "custom"}
        label="قیمت ها را خودم دستی وارد می کنم"
        onCheckedChange={() => setConfigType("custom")}
        value="custom"
        size="LargeRadioButton"
      /> */}
      {<PricingForm />}
      {/* {configType === "sanjagh" && (
        <div className="fixed bottom-0 py-2 left-0 right-0 px-4 bg-white z-1 border border-white">
          <Button
            buttonVariant="PrimarySolidButton"
            contentVariant={{ TAG: "Text", value: "ذخیره تغییرات" }}
            heightVariant="LGButton"
            widthVariant="FixedWidthButton"
          />
        </div>
      )} */}
    </>
  );
}
