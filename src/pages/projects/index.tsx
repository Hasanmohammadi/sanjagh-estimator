import { Button } from "@skul/sanjagh-design-system/src/Design_Button.tsx";
import DesignTitle from "@skul/sanjagh-design-system/src/Design_Title";
import { Accordion } from "../../components";
import { DownloadIcon, EditIcon } from "../../assets/icons";

export default function Projects() {
  const projects = [
    {
      id: 1,
      title: "خانه ی سعادت آباد",
      date: "۱۴۰۴/۰۳/۲۱",
      costumerName: "آقای نجاتی",
      meterage: 120,
    },
    {
      id: 2,
      title: "خانه ی سعادت آباد",
      date: "۱۴۰۴/۰۳/۲۱",
      costumerName: "آقای نجاتی",
      meterage: 120,
    },
    {
      id: 3,
      title: "خانه ی سعادت آباد",
      date: "۱۴۰۴/۰۳/۲۱",
      costumerName: "آقای نجاتی",
      meterage: 120,
    },
    {
      id: 4,
      title: "خانه ی سعادت آباد",
      date: "۱۴۰۴/۰۳/۲۱",
      costumerName: "آقای نجاتی",
      meterage: 120,
    },
    {
      id: 4,
      title: "خانه ی سعادت آباد",
      date: "۱۴۰۴/۰۳/۲۱",
      costumerName: "آقای نجاتی",
      meterage: 120,
    },
    {
      id: 4,
      title: "خانه ی سعادت آباد",
      date: "۱۴۰۴/۰۳/۲۱",
      costumerName: "آقای نجاتی",
      meterage: 120,
    },
    {
      id: 4,
      title: "خانه ی سعادت آباد",
      date: "۱۴۰۴/۰۳/۲۱",
      costumerName: "آقای نجاتی",
      meterage: 120,
    },
    {
      id: 4,
      title: "خانه ی سعادت آباد",
      date: "۱۴۰۴/۰۳/۲۱",
      costumerName: "آقای نجاتی",
      meterage: 120,
    },
    {
      id: 4,
      title: "خانه ی سعادت آباد",
      date: "۱۴۰۴/۰۳/۲۱",
      costumerName: "آقای نجاتی",
      meterage: 120,
    },
    {
      id: 4,
      title: "خانه ی سعادت آباد",
      date: "۱۴۰۴/۰۳/۲۱",
      costumerName: "آقای نجاتی",
      meterage: 120,
    },
    {
      id: 4,
      title: "خانه ی سعادت آباد",
      date: "۱۴۰۴/۰۳/۲۱",
      costumerName: "آقای نجاتی",
      meterage: 120,
    },
    {
      id: 4,
      title: "خانه ی سعادت آباد",
      date: "۱۴۰۴/۰۳/۲۱",
      costumerName: "آقای نجاتی",
      meterage: 120,
    },
  ];

  return (
    <div className="flex flex-col">
      <div className="sticky top-0 pt-3 h-12 bg-design-white">
        <Button
          buttonVariant="PrimarySolidButton"
          contentVariant={{ TAG: "Text", value: "ایجاد پروژه ی جدید" }}
          heightVariant="MDButton"
          widthVariant="FixedWidthButton"
        />
      </div>

      {projects.length ? (
        <div className="mt-6">
          <DesignTitle sizeVariant="SecondTitle" text="پروژه های قبلی" titleVariant="Body" color="BlackMain" />
          {projects.map(({ id, costumerName, date, meterage, title }) => (
            <div className="mt-3" key={id}>
              <Accordion date={date} title={title}>
                <div className="flex justify-end gap-2 items-center">
                  <div className="bg-design-gray-100 p-2.5 rounded-xl">
                    <EditIcon />
                  </div>
                  <div className="bg-design-gray-100 p-2.5 rounded-xl">
                    <DownloadIcon />
                  </div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <DesignTitle sizeVariant="SmallSubtitle" text={date} titleVariant="Body" color="BlackMain" />
                  <DesignTitle sizeVariant="SmallSubtitle" text={costumerName} titleVariant="Body" color="BlackMain" />
                  <DesignTitle
                    sizeVariant="SmallSubtitle"
                    text={`${meterage} متر`}
                    titleVariant="Body"
                    color="BlackMain"
                  />
                </div>
              </Accordion>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4 h-full items-center mt-20">
          <DesignTitle
            sizeVariant="SecondTitle"
            text="هیچ پروژه‌ای وجود ندارد!"
            titleVariant="SecondHeader"
            color="Gray500"
          />

          <DesignTitle
            sizeVariant="Subtitle"
            text="برای شروع، یک پروژه جدید بسازید"
            titleVariant="Body"
            color="Gray400"
          />
        </div>
      )}
    </div>
  );
}
