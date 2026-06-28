export type PaintType = "plastic" | "oil" | "acrylic";

export interface PaintPrices {
  plastic_with?: number;
  plastic_without?: number;
  oil_with?: number;
  oil_without?: number;
  acrylic_with?: number;
  acrylic_without?: number;
}

export interface PaintPricePerLiter {
  plastic?: number;
  oil?: number;
  acrylic?: number;
}

export interface RoomInput {
  width: number;
  length: number;
  height: number;
  wall_paint_type: PaintType;
  wall_coats: number;
  ceiling_enabled: boolean;
  ceiling_paint_type?: PaintType;
  ceiling_coats?: number;
}

export interface RoomEstimate {
  wall_area: number;
  ceiling_area: number;
  total_area: number;
  wall_paint_liters: number;
  ceiling_paint_liters: number;
  total_paint_liters: number;
  wall_paint_cost: number;
  ceiling_paint_cost: number;
  labor_cost: number;
}

export interface EstimateResult {
  rooms: RoomEstimate[];
  total_area: number;
  total_paint_liters: number;
  total_paint_cost: number;
  total_labor_cost: number;
  accessories_cost: number;
  base_cost: number;
  min_price: number;
  max_price: number;
  days: number;
}

// ضریب پوشش‌دهی هر نوع رنگ (متر مربع به ازای هر لیتر)
const COVERAGE: Record<PaintType, number> = {
  plastic: 10,
  oil: 9,
  acrylic: 12,
};

const WASTE_FACTOR = 1.1;
const SQM_PER_DAY = 53;

const calcPaintLiters = (area: number, coats: number, paintType: PaintType): number => {
  return Math.ceil((area * coats * WASTE_FACTOR) / COVERAGE[paintType]);
};

const calcRoomEstimate = (
  room: RoomInput,
  paintPrices: PaintPrices,
  paintPricePerLiter: PaintPricePerLiter,
  withMaterials: boolean,
): RoomEstimate => {
  const wall_area = 2 * (room.width + room.length) * room.height;
  const ceiling_area = room.ceiling_enabled ? room.width * room.length : 0;
  const total_area = wall_area + ceiling_area;

  // لیتر رنگ (برای نمایش به کاربر)
  const wall_paint_liters = calcPaintLiters(wall_area, room.wall_coats, room.wall_paint_type);
  const ceiling_paint_liters =
    room.ceiling_enabled && room.ceiling_paint_type && room.ceiling_coats
      ? calcPaintLiters(ceiling_area, room.ceiling_coats, room.ceiling_paint_type)
      : 0;

  // قیمت متوسط هر متر مربع (با یا بدون مصالح)
  const getAvgPrice = (paintType: PaintType): number => {
    const withKey = `${paintType}_with` as keyof PaintPrices;
    const withoutKey = `${paintType}_without` as keyof PaintPrices;
    const priceWith = paintPrices[withKey] ?? 0;
    const priceWithout = paintPrices[withoutKey] ?? 0;

    if (withMaterials && priceWith && priceWithout) {
      return (priceWith + priceWithout) / 2;
    }
    if (!withMaterials && priceWithout) {
      return priceWithout;
    }
    return withMaterials ? priceWith : priceWithout;
  };

  // هزینه دیوار
  const wallAvgPrice = getAvgPrice(room.wall_paint_type);
  const wall_cost = wall_area * room.wall_coats * WASTE_FACTOR * wallAvgPrice;

  // هزینه سقف
  let ceiling_cost = 0;
  if (room.ceiling_enabled && room.ceiling_paint_type && room.ceiling_coats) {
    const ceilAvgPrice = getAvgPrice(room.ceiling_paint_type);
    ceiling_cost = ceiling_area * room.ceiling_coats * WASTE_FACTOR * ceilAvgPrice;
  }

  // هزینه رنگ جداگانه (برای نمایش جزییات)
  const wallPricePerLiter = paintPricePerLiter[room.wall_paint_type] ?? 0;
  const wall_paint_cost = wall_paint_liters * wallPricePerLiter;

  const ceilPricePerLiter = room.ceiling_paint_type ? (paintPricePerLiter[room.ceiling_paint_type] ?? 0) : 0;
  const ceiling_paint_cost = ceiling_paint_liters * ceilPricePerLiter;

  return {
    wall_area,
    ceiling_area,
    total_area,
    wall_paint_liters,
    ceiling_paint_liters,
    total_paint_liters: wall_paint_liters + ceiling_paint_liters,
    wall_paint_cost,
    ceiling_paint_cost,
    labor_cost: wall_cost + ceiling_cost, // اجرت بر اساس فرمول سند
  };
};

const calcAccessoriesCost = (paintPricePerLiter: PaintPricePerLiter, total_area: number): number => {
  const prices = Object.values(paintPricePerLiter).filter((p): p is number => p !== undefined && p > 0);

  if (prices.length === 0) {
    return 0;
  }

  const avgPricePerLiter = prices.reduce((a, b) => a + b, 0) / prices.length;
  const base = avgPricePerLiter * 2;
  const perSqm = (avgPricePerLiter / 30) * total_area;

  return base + perSqm;
};

export const calculateEstimate = (
  rooms: RoomInput[],
  paintPrices: PaintPrices,
  paintPricePerLiter: PaintPricePerLiter,
  withMaterials: boolean,
): EstimateResult => {
  const roomEstimates = rooms.map(room => calcRoomEstimate(room, paintPrices, paintPricePerLiter, withMaterials));

  const total_area = roomEstimates.reduce((s, r) => s + r.total_area, 0);
  const total_paint_liters = roomEstimates.reduce((s, r) => s + r.total_paint_liters, 0);
  const total_paint_cost = roomEstimates.reduce((s, r) => s + r.wall_paint_cost + r.ceiling_paint_cost, 0);
  const total_labor_cost = roomEstimates.reduce((s, r) => s + r.labor_cost, 0);
  const accessories_cost = calcAccessoriesCost(paintPricePerLiter, total_area);

  const base_cost = total_paint_cost + total_labor_cost + accessories_cost;

  const days = Math.max(1, Math.ceil(total_area / SQM_PER_DAY));

  // بازه قیمت پیشنهادی
  const min_price = base_cost * 0.8;
  const max_price = base_cost * 1.2;

  return {
    rooms: roomEstimates,
    total_area,
    total_paint_liters,
    total_paint_cost,
    total_labor_cost,
    accessories_cost,
    base_cost,
    min_price,
    max_price,
    days,
  };
};
