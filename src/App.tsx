import { Button } from "@skul/sanjagh-design-system/src/Design_Button.tsx";

function App() {
  return (
    <div className="text-center">
      <div>بازار آنلاین خدمات</div>
      سلام سنجاق <br />
      <div className="flex gap-10 px-4 my-10">
        <Button
          buttonVariant="SecondaryGrayButton"
          contentVariant={{ TAG: "Text", value: "تایید" }}
          heightVariant="MDButton"
          widthVariant="FixedWidthButton"
        />
        <Button
          buttonVariant="SecondaryOutlineButton"
          contentVariant={{ TAG: "Text", value: "تایید" }}
          heightVariant="MDButton"
          widthVariant="FixedWidthButton"
        />
        <Button
          buttonVariant="PrimarySolidButton"
          contentVariant={{ TAG: "Text", value: "تایید" }}
          heightVariant="MDButton"
          widthVariant="FixedWidthButton"
        />
      </div>
    </div>
  );
}

export default App;
