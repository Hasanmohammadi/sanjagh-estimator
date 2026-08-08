import * as yup from "yup";

// Treat empty inputs as `undefined` so the "required" message shows
// instead of the "must be a number" type error.
const emptyToUndefined = (value: unknown, original: unknown) =>
  original === "" || original == null ? undefined : value;

const priceNumber = (requiredMessage: string) =>
  yup
    .number()
    .transform(emptyToUndefined)
    .typeError("قیمت باید عدد باشد")
    .required(requiredMessage)
    .min(1000, "حداقل قیمت باید 1000 باشد");

type RangeValue = {
  min?: number;
  max?: number;
};

const rangeEntrySchema = yup.object({
  min: priceNumber("وارد کردن حداقل قیمت الزامی است"),
  max: priceNumber("وارد کردن حداکثر قیمت الزامی است").test(
    "max-greater-than-min",
    "حداکثر قیمت باید بزرگ‌تر یا مساوی حداقل قیمت باشد",
    function (value) {
      const { min } = this.parent as RangeValue;

      if (value == null || min == null) {
        return true;
      }

      return value >= min;
    },
  ),
});

const singleEntrySchema = yup.object({
  price: priceNumber("وارد کردن قیمت الزامی است"),
});

export const pricingFormSchema = yup.object({
  plasticService: rangeEntrySchema,
  oilService: rangeEntrySchema,
  acrylicService: rangeEntrySchema,

  plasticLiter: singleEntrySchema,
  oilLiter: singleEntrySchema,
  acrylicLiter: singleEntrySchema,
});

export type PricingFormValues = yup.InferType<typeof pricingFormSchema>;
