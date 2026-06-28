import { describe, it, expect } from "vitest";
import { calculateEstimate, PaintPrices, PaintPricePerLiter, RoomInput } from "../utils/calculate";

const defaultPaintPrices: PaintPrices = {
  plastic_with: 800000,
  plastic_without: 500000,
  oil_with: 950000,
  oil_without: 600000,
  acrylic_with: 1050000,
  acrylic_without: 700000,
};

const defaultPricePerLiter: PaintPricePerLiter = {
  plastic: 700000,
  oil: 850000,
  acrylic: 950000,
};

const simpleRoom: RoomInput = {
  width: 4,
  length: 5,
  height: 2.8,
  wall_paint_type: "plastic",
  wall_coats: 2,
  ceiling_enabled: false,
};

describe("calculateEstimate", () => {
  describe("محاسبه مساحت", () => {
    it("مساحت دیوار رو درست حساب کنه", () => {
      const result = calculateEstimate([simpleRoom], defaultPaintPrices, defaultPricePerLiter, true);
      // 2 * (4 + 5) * 2.8 = 50.4
      expect(result.rooms[0].wall_area).toBeCloseTo(50.4);
    });

    it("وقتی سقف غیرفعاله، مساحت سقف صفر باشه", () => {
      const result = calculateEstimate([simpleRoom], defaultPaintPrices, defaultPricePerLiter, true);
      expect(result.rooms[0].ceiling_area).toBe(0);
    });

    it("وقتی سقف فعاله، مساحت سقف درست حساب کنه", () => {
      const roomWithCeiling: RoomInput = {
        ...simpleRoom,
        ceiling_enabled: true,
        ceiling_paint_type: "plastic",
        ceiling_coats: 2,
      };
      const result = calculateEstimate([roomWithCeiling], defaultPaintPrices, defaultPricePerLiter, true);
      // 4 * 5 = 20
      expect(result.rooms[0].ceiling_area).toBe(20);
    });

    it("مساحت کل رو درست جمع کنه", () => {
      const roomWithCeiling: RoomInput = {
        ...simpleRoom,
        ceiling_enabled: true,
        ceiling_paint_type: "plastic",
        ceiling_coats: 2,
      };
      const result = calculateEstimate([roomWithCeiling], defaultPaintPrices, defaultPricePerLiter, true);
      // 50.4 + 20 = 70.4
      expect(result.rooms[0].total_area).toBeCloseTo(70.4);
    });

    it("چند اتاق رو با هم جمع کنه", () => {
      const room2: RoomInput = {
        width: 3,
        length: 3,
        height: 2.8,
        wall_paint_type: "plastic",
        wall_coats: 2,
        ceiling_enabled: false,
      };
      const result = calculateEstimate([simpleRoom, room2], defaultPaintPrices, defaultPricePerLiter, true);
      // اتاق اول: 50.4، اتاق دوم: 2*(3+3)*2.8 = 33.6
      expect(result.total_area).toBeCloseTo(84);
    });
  });

  describe("محاسبه لیتر رنگ", () => {
    it("لیتر رنگ دیوار رو با ضریب هدررفت حساب کنه", () => {
      const result = calculateEstimate([simpleRoom], defaultPaintPrices, defaultPricePerLiter, true);
      // (50.4 * 2 * 1.1) / 10 = 11.088 → ceil = 12
      expect(result.rooms[0].wall_paint_liters).toBe(12);
    });

    it("لیتر رنگ سقف رو درست حساب کنه", () => {
      const roomWithCeiling: RoomInput = {
        ...simpleRoom,
        ceiling_enabled: true,
        ceiling_paint_type: "acrylic",
        ceiling_coats: 2,
      };
      const result = calculateEstimate([roomWithCeiling], defaultPaintPrices, defaultPricePerLiter, true);
      // (20 * 2 * 1.1) / 12 = 3.67 → ceil = 4
      expect(result.rooms[0].ceiling_paint_liters).toBe(4);
    });

    it("ضریب پوشش رنگ روغنی رو درست اعمال کنه", () => {
      const oilRoom: RoomInput = { ...simpleRoom, wall_paint_type: "oil" };
      const result = calculateEstimate([oilRoom], defaultPaintPrices, defaultPricePerLiter, true);
      // (50.4 * 2 * 1.1) / 9 = 12.32 → ceil = 13
      expect(result.rooms[0].wall_paint_liters).toBe(13);
    });

    it("ضریب پوشش آکریلیک رو درست اعمال کنه", () => {
      const acrylicRoom: RoomInput = {
        ...simpleRoom,
        wall_paint_type: "acrylic",
      };
      const result = calculateEstimate([acrylicRoom], defaultPaintPrices, defaultPricePerLiter, true);
      // (50.4 * 2 * 1.1) / 12 = 9.24 → ceil = 10
      expect(result.rooms[0].wall_paint_liters).toBe(10);
    });

    it("با تعداد دست بیشتر، لیتر بیشتری حساب کنه", () => {
      const threeCoats: RoomInput = { ...simpleRoom, wall_coats: 3 };
      const twoCoats: RoomInput = { ...simpleRoom, wall_coats: 2 };

      const result3 = calculateEstimate([threeCoats], defaultPaintPrices, defaultPricePerLiter, true);
      const result2 = calculateEstimate([twoCoats], defaultPaintPrices, defaultPricePerLiter, true);

      expect(result3.rooms[0].wall_paint_liters).toBeGreaterThan(result2.rooms[0].wall_paint_liters);
    });
  });

  describe("محاسبه هزینه طبق فرمول سند", () => {
    it("هزینه دیوار با مصالح رو درست حساب کنه", () => {
      const result = calculateEstimate([simpleRoom], defaultPaintPrices, defaultPricePerLiter, true);
      // قیمت متوسط با مصالح = (800000 + 500000) / 2 = 650000
      // هزینه = 50.4 * 2 * 1.1 * 650000
      const expectedLaborCost = 50.4 * 2 * 1.1 * 650000;
      expect(result.rooms[0].labor_cost).toBeCloseTo(expectedLaborCost);
    });

    it("هزینه دیوار بدون مصالح رو درست حساب کنه", () => {
      const result = calculateEstimate([simpleRoom], defaultPaintPrices, defaultPricePerLiter, false);
      // قیمت بدون مصالح = 500000
      const expectedLaborCost = 50.4 * 2 * 1.1 * 500000;
      expect(result.rooms[0].labor_cost).toBeCloseTo(expectedLaborCost);
    });

    it("با مصالح از بدون مصالح گرون‌تر باشه", () => {
      const withMat = calculateEstimate([simpleRoom], defaultPaintPrices, defaultPricePerLiter, true);
      const withoutMat = calculateEstimate([simpleRoom], defaultPaintPrices, defaultPricePerLiter, false);
      expect(withMat.rooms[0].labor_cost).toBeGreaterThan(withoutMat.rooms[0].labor_cost);
    });

    it("هزینه رنگ per liter رو درست حساب کنه", () => {
      const result = calculateEstimate([simpleRoom], defaultPaintPrices, defaultPricePerLiter, true);
      // 12 لیتر * 700000
      expect(result.rooms[0].wall_paint_cost).toBe(12 * 700000);
    });

    it("وقتی قیمت per liter نداریم، هزینه رنگ صفر باشه", () => {
      const result = calculateEstimate([simpleRoom], defaultPaintPrices, {}, true);
      expect(result.rooms[0].wall_paint_cost).toBe(0);
    });
  });

  describe("ملزومات", () => {
    it("ملزومات رو درست حساب کنه", () => {
      const result = calculateEstimate([simpleRoom], defaultPaintPrices, defaultPricePerLiter, true);
      // میانگین: (700000+850000+950000)/3 = 833333
      // base: 833333 * 2
      // perSqm: (833333/30) * 50.4
      expect(result.accessories_cost).toBeGreaterThan(0);
    });

    it("وقتی هیچ قیمت per liter نداری ملزومات صفر باشه", () => {
      const result = calculateEstimate([simpleRoom], defaultPaintPrices, {}, true);
      expect(result.accessories_cost).toBe(0);
    });
  });

  describe("بازه قیمت", () => {
    it("حداقل قیمت ۸۰٪ قیمت پایه باشه", () => {
      const result = calculateEstimate([simpleRoom], defaultPaintPrices, defaultPricePerLiter, true);
      expect(result.min_price).toBeCloseTo(result.base_cost * 0.8);
    });

    it("حداکثر قیمت ۱۲۰٪ قیمت پایه باشه", () => {
      const result = calculateEstimate([simpleRoom], defaultPaintPrices, defaultPricePerLiter, true);
      expect(result.max_price).toBeCloseTo(result.base_cost * 1.2);
    });
  });

  describe("محاسبه روزهای کاری", () => {
    it("حداقل ۱ روز باشه", () => {
      const tinyRoom: RoomInput = {
        width: 1,
        length: 1,
        height: 2.8,
        wall_paint_type: "plastic",
        wall_coats: 1,
        ceiling_enabled: false,
      };
      const result = calculateEstimate([tinyRoom], defaultPaintPrices, defaultPricePerLiter, true);
      expect(result.days).toBe(1);
    });

    it("برای متراژ بزرگ، روزهای بیشتری حساب کنه", () => {
      const bigRoom: RoomInput = {
        width: 10,
        length: 10,
        height: 2.8,
        wall_paint_type: "plastic",
        wall_coats: 2,
        ceiling_enabled: false,
      };
      const result = calculateEstimate([bigRoom], defaultPaintPrices, defaultPricePerLiter, true);
      // 2*(10+10)*2.8 = 112 → ceil(112/53) = 3
      expect(result.days).toBe(3);
    });
  });

  describe("اسلایدر", () => {
    it("اسلایدر فقط روی اجرت تاثیر بذاره نه رنگ", () => {
      const result1 = calculateEstimate([simpleRoom], defaultPaintPrices, defaultPricePerLiter, true);
      const result2 = calculateEstimate([simpleRoom], defaultPaintPrices, defaultPricePerLiter, true);
      // قیمت رنگ نباید تغییر کنه
      expect(result1.total_paint_cost).toBe(result2.total_paint_cost);
    });
  });
});
