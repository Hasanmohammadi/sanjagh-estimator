import { RadioButton } from "@skul/sanjagh-design-system/src/Design_RadioButton";
import { useEffect, useState } from "react";
import { Button } from "@skul/sanjagh-design-system/src/Design_Button";
import { useUpdateSettings } from "@/hooks/settings/useUpdateSettings";
import professional from "@/assets/pic/theme/professional.png";
import accurate from "@/assets/pic/theme/accurate.png";
import light from "@/assets/pic/theme/light.png";
import classic from "@/assets/pic/theme/classic.png";
import type { Theme } from "@/api/services/settings";
import { useNavigate } from "react-router-dom";
import { useSettings } from "@/hooks/settings/useSettings";
import { ConfirmModal, Spinner } from "@/components/common";
import DesignTitle from "@skul/sanjagh-design-system/src/Design_Title";
import { ProLogo } from "@/assets/icons";

type ThemeObject = {
  id: Theme;
  title: string;
  image: string;
};

const themes: ThemeObject[] = [
  { id: "classic", title: "کلاسیک", image: classic },
  { id: "light", title: "روشن", image: light },
  { id: "accurate", title: "دقیق", image: accurate },
  { id: "professional", title: "حرفه ای", image: professional },
];

export default function ThemeSelector() {
  const isPro = false;
  const [selectedTheme, setSelectedTheme] = useState<Theme>("classic");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const { data, isPending: loading } = useSettings();
  const { mutate: updateSettingsAction, isPending: isSaving } = useUpdateSettings({
    onSuccess: () => navigate(-1),
  });

  useEffect(() => {
    if (data) setSelectedTheme(data?.theme);
  }, [data]);

  return loading ? (
    <div className="flex min-h-75 items-center justify-center">
      <Spinner />
    </div>
  ) : (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 justify-items-center">
        {themes.map(({ id, image, title }) => {
          const selected = selectedTheme === id;

          return (
            <button
              key={id}
              type="button"
              onClick={() => setSelectedTheme(id)}
              className="rounded-xl p-2 shadow-design-gray-600 shadow w-fit"
            >
              <div className="mb-2 flex items-center">
                <RadioButton
                  label={title}
                  checked={selected}
                  onCheckedChange={() => setSelectedTheme(id)}
                  value="custom"
                  size="LargeRadioButton"
                />
              </div>

              <img src={image} />
            </button>
          );
        })}
      </div>
      {isPro ? (
        <div className="fixed bottom-0 left-0 right-0 px-4 py-2 bg-white border shadow-design-black-1 shadow-2xl rounded-t-3xl border-white z-10">
          <Button
            buttonVariant="PrimarySolidButton"
            contentVariant={{
              TAG: "Text",
              value: "انتخاب زمینه نمایش",
            }}
            heightVariant="LGButton"
            widthVariant="FixedWidthButton"
            onClick={() => updateSettingsAction({ theme: selectedTheme })}
            disabled={isSaving}
          />
        </div>
      ) : (
        <div className="fixed bottom-0 left-0 right-0 px-4 py-2 bg-white border shadow-design-black-1 shadow-2xl rounded-t-3xl border-white z-10">
          <Button
            buttonVariant="PrimarySolidButton"
            contentVariant={{
              TAG: "Text",
              value: "انتخاب زمینه نمایش",
            }}
            heightVariant="LGButton"
            widthVariant="FixedWidthButton"
            onClick={() => setIsOpen(true)}
          />
        </div>
      )}

      <ConfirmModal
        open={isOpen}
        onCancel={() => {
          setSelectedTheme("classic");
          setIsOpen(false);
        }}
        onConfirm={() => window.open("https://sanjagh.pro/", "_blank")}
        title={
          <div className="flex items-center gap-2">
            <DesignTitle text="خرید اشتراک" sizeVariant="ThirdTitle" titleVariant="Body" />
            <ProLogo />
          </div>
        }
        description={
          <DesignTitle
            sizeVariant="Body"
            text="این ویژگی فقط در اشتراک پرو سنجاق قابل استفاده است."
            titleVariant="Body"
            color="Gray500"
          />
        }
        confirmLabel="خرید اشتراک"
      />
    </div>
  );
}
