import { describe, it, expect } from "vitest";
import { calculateEstimate, PriceConfig, RoomInput } from "../utils/calculate";

const defaultConfig: PriceConfig = {
  plastic_per_liter: 700000,
  oil_per_liter: 850000,
  acrylic_per_liter: 950000,
  plastic_without_min: 500000,
  plastic_without_max: 800000,
  oil_without_min: 600000,
  oil_without_max: 950000,
  acrylic_without_min: 700000,
  acrylic_without_max: 1050000,
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
      const result = calculateEstimate([simpleRoom], defaultConfig);
      expect(result.rooms[0].wall_area).toBeCloseTo(50.4);
    });

    it("وقتی سقف غیرفعاله، مساحت سقف صفر باشه", () => {
      const result = calculateEstimate([simpleRoom], defaultConfig);
      expect(result.rooms[0].ceiling_area).toBe(0);
    });

    it("وقتی سقف فعاله، مساحت سقف درست حساب کنه", () => {
      const roomWithCeiling: RoomInput = {
        ...simpleRoom,
        ceiling_enabled: true,
        ceiling_paint_type: "plastic",
        ceiling_coats: 2,
      };
      const result = calculateEstimate([roomWithCeiling], defaultConfig);
      expect(result.rooms[0].ceiling_area).toBe(20);
    });

    it("مساحت کل رو درست جمع کنه", () => {
      const roomWithCeiling: RoomInput = {
        ...simpleRoom,
        ceiling_enabled: true,
        ceiling_paint_type: "plastic",
        ceiling_coats: 2,
      };
      const result = calculateEstimate([roomWithCeiling], defaultConfig);
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
      const result = calculateEstimate([simpleRoom, room2], defaultConfig);
      expect(result.total_area).toBeCloseTo(84);
    });
  });

  describe("محاسبه لیتر رنگ", () => {
    it("لیتر رنگ دیوار رو با ضریب هدررفت حساب کنه", () => {
      const result = calculateEstimate([simpleRoom], defaultConfig);
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
      const result = calculateEstimate([roomWithCeiling], defaultConfig);
      // (20 * 2 * 1.1) / 12 = 3.67 → ceil = 4
      expect(result.rooms[0].ceiling_paint_liters).toBe(4);
    });

    it("ضریب پوشش رنگ روغنی رو درست اعمال کنه", () => {
      const oilRoom: RoomInput = { ...simpleRoom, wall_paint_type: "oil" };
      const result = calculateEstimate([oilRoom], defaultConfig);
      // (50.4 * 2 * 1.1) / 9 = 12.32 → ceil = 13
      expect(result.rooms[0].wall_paint_liters).toBe(13);
    });

    it("ضریب پوشش آکریلیک رو درست اعمال کنه", () => {
      const acrylicRoom: RoomInput = { ...simpleRoom, wall_paint_type: "acrylic" };
      const result = calculateEstimate([acrylicRoom], defaultConfig);
      // (50.4 * 2 * 1.1) / 12 = 9.24 → ceil = 10
      expect(result.rooms[0].wall_paint_liters).toBe(10);
    });

    it("با تعداد دست بیشتر، لیتر بیشتری حساب کنه", () => {
      const threeCoats: RoomInput = { ...simpleRoom, wall_coats: 3 };
      const twoCoats: RoomInput = { ...simpleRoom, wall_coats: 2 };

      const result3 = calculateEstimate([threeCoats], defaultConfig);
      const result2 = calculateEstimate([twoCoats], defaultConfig);

      expect(result3.rooms[0].wall_paint_liters).toBeGreaterThan(result2.rooms[0].wall_paint_liters);
    });
  });

  describe("محاسبه هزینه طبق فرمول سند", () => {
    it("هزینه دیوار بدون مصالح رو درست حساب کنه", () => {
      const result = calculateEstimate([simpleRoom], defaultConfig);
      const expectedLaborCost = 50.4 * 2 * 1.1 * 650000;
      expect(result.rooms[0].wall_labor_cost).toBeCloseTo(expectedLaborCost);
    });

    it("هزینه رنگ per liter رو درست حساب کنه", () => {
      const result = calculateEstimate([simpleRoom], defaultConfig);
      expect(result.rooms[0].wall_paint_cost).toBe(12 * 700000);
    });

    it("وقتی قیمت per liter نداریم، هزینه رنگ صفر باشه", () => {
      const configWithoutLiter: PriceConfig = {
        plastic_without_min: 500000,
        plastic_without_max: 800000,
      };
      const result = calculateEstimate([simpleRoom], configWithoutLiter);
      expect(result.rooms[0].wall_paint_cost).toBe(0);
    });
  });

  describe("ملزومات", () => {
    it("ملزومات رو درست حساب کنه", () => {
      const result = calculateEstimate([simpleRoom], defaultConfig);
      expect(result.accessories_cost).toBeGreaterThan(0);
    });

    it("وقتی هیچ قیمت per liter نداری ملزومات صفر باشه", () => {
      const configWithoutLiter: PriceConfig = {
        plastic_without_min: 500000,
        plastic_without_max: 800000,
      };
      const result = calculateEstimate([simpleRoom], configWithoutLiter);
      expect(result.accessories_cost).toBe(0);
    });
  });

  describe("بازه قیمت", () => {
    it("حداقل قیمت ۸۰٪ قیمت پایه باشه", () => {
      const result = calculateEstimate([simpleRoom], defaultConfig);
      expect(result.min_price).toBeCloseTo(result.base_cost * 0.8);
    });

    it("حداکثر قیمت ۱۲۰٪ قیمت پایه باشه", () => {
      const result = calculateEstimate([simpleRoom], defaultConfig);
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
      const result = calculateEstimate([tinyRoom], defaultConfig);
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
      const result = calculateEstimate([bigRoom], defaultConfig);
      // 2*(10+10)*2.8 = 112 → ceil(112/53) = 3
      expect(result.days).toBe(3);
    });
  });

  describe("اسلایدر", () => {
    it("قیمت رنگ با config یکسان تغییر نکنه", () => {
      const result1 = calculateEstimate([simpleRoom], defaultConfig);
      const result2 = calculateEstimate([simpleRoom], defaultConfig);
      expect(result1.total_paint_cost).toBe(result2.total_paint_cost);
    });
  });
});
