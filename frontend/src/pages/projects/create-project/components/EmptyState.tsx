import DesignTitle from "@skul/sanjagh-design-system/src/Design_Title";

export default function EmptyState() {
  return (
    <div className="flex flex-col gap-4 items-center mt-20">
      <DesignTitle
        sizeVariant="SecondTitle"
        text="هیچ اتاقی اضافه نشده"
        titleVariant="SecondHeader"
        color="BlackMain"
      />

      <DesignTitle
        sizeVariant="ThirdTitle"
        text="برای شروع، یک اتاق اضافه کنید"
        titleVariant="SixthHeader"
        color="Gray400"
      />
    </div>
  );
}
