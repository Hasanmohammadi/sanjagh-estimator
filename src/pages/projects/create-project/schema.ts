import * as yup from "yup";

export const roomSchema = yup.object({
  roomType: yup.string().required(),

  length: yup
    .number()
    .typeError("طول معتبر نیست")
    .min(0.8, "حداقل طول ۰.۸ متر است")
    .max(25, "حداکثر طول ۲۵ متر است")
    .required(),

  width: yup
    .number()
    .typeError("عرض معتبر نیست")
    .min(0.8, "حداقل عرض ۰.۸ متر است")
    .max(25, "حداکثر عرض ۲۵ متر است")
    .required(),

  height: yup
    .number()
    .typeError("ارتفاع معتبر نیست")
    .min(2, "حداقل ارتفاع ۲ متر است")
    .max(10, "حداکثر ارتفاع ۱۰ متر است")
    .required(),

  wallPaintType: yup.string().required(),

  wallCoatCount: yup.number().min(1).max(4, "حداکثر تعداد دست رنگ دیوار ۴ است").required(),

  hasRoofColor: yup.boolean().required(),

  roofPaintType: yup.string().when("hasRoofColor", {
    is: true,
    then: schema => schema.required(),
    otherwise: schema => schema.optional(),
  }),

  roofCoatCount: yup.number().when("hasRoofColor", {
    is: true,
    then: schema => schema.min(1).max(4, "حداکثر تعداد دست رنگ سقف ۴ است").required(),
    otherwise: schema => schema.optional(),
  }),
});

export type RoomFormData = yup.InferType<typeof roomSchema>;
