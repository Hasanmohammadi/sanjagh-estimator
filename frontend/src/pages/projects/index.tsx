import { Button } from "@skul/sanjagh-design-system/src/Design_Button.tsx";
import DesignTitle from "@skul/sanjagh-design-system/src/Design_Title";
import { Accordion, Spinner } from "@/components/common";
import { useNavigate } from "react-router-dom";
import { useProjects } from "@/hooks/projects/useProjects";
import { useCreateProject } from "@/hooks/projects/useCreateProject";
import { formatJalaliDate } from "@/utils/date";

export default function Projects() {
  const navigate = useNavigate();

  const { data: projects, isPending } = useProjects();
  const { mutate: createProject } = useCreateProject({
    onSuccess: project => {
      navigate(`/create-projects?projectId=${project?.id}`);
    },
  });

  return (
    <div className="flex flex-col">
      <div className="sticky top-0 pt-3 h-12 bg-design-white">
        <Button
          buttonVariant="PrimarySolidButton"
          contentVariant={{ TAG: "Text", value: "ایجاد پروژه ی جدید" }}
          heightVariant="MDButton"
          widthVariant="FixedWidthButton"
          onClick={() => {
            createProject({ title: `پروژه ناقص است` });
          }}
        />
      </div>

      {isPending ? (
        <div className="flex min-h-75 items-center justify-center">
          <Spinner />
        </div>
      ) : projects?.length ? (
        <div className="mt-6">
          <DesignTitle sizeVariant="SecondTitle" text="پروژه های قبلی" titleVariant="Body" color="BlackMain" />
          {projects.map(({ id, created_at, customer_name, meterage, title }) => (
            <div className="mt-3" key={id}>
              <Accordion date={formatJalaliDate(created_at)} title={`پروژه: ${title}`}>
                <div className="flex justify-between items-center mt-4">
                  <DesignTitle
                    sizeVariant="SmallSubtitle"
                    text={formatJalaliDate(created_at)}
                    titleVariant="Body"
                    color="BlackMain"
                  />
                  <DesignTitle sizeVariant="SmallSubtitle" text={customer_name} titleVariant="Body" color="BlackMain" />
                  <DesignTitle
                    sizeVariant="SmallSubtitle"
                    text={`${meterage} متر`}
                    titleVariant="Body"
                    color="BlackMain"
                  />
                  <Button
                    buttonVariant="PrimarySolidButton"
                    contentVariant={{
                      TAG: "Text",
                      value: "جزئیات بیشتر",
                    }}
                    heightVariant="XSButton"
                    widthVariant="AutoWidthButton"
                    onClick={() => navigate(`/final-estimation?projectId=${id}`)}
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
