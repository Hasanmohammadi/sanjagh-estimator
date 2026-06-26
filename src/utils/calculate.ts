export type PaintType = "plastic" | "oil" | "acrylic";

export interface PaintPrices {
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

const calcPaintLiters = (
  area: number,
  coats: number,
  paintType: PaintType,
): number => {
  return Math.ceil((area * coats * WASTE_FACTOR) / COVERAGE[paintType]);
};

const calcRoomEstimate = (
  room: RoomInput,
  paintPrices: PaintPrices,
  laborPricePerSqm: number,
): RoomEstimate => {
  // مساحت دیوار
  const wall_area = 2 * (room.width + room.length) * room.height;

  // مساحت سقف
  const ceiling_area = room.ceiling_enabled ? room.width * room.length : 0;

  const total_area = wall_area + ceiling_area;

  // لیتر رنگ دیوار
  const wall_paint_liters = calcPaintLiters(
    wall_area,
    room.wall_coats,
    room.wall_paint_type,
  );

  // لیتر رنگ سقف
  const ceiling_paint_liters =
    room.ceiling_enabled && room.ceiling_paint_type && room.ceiling_coats
      ? calcPaintLiters(
          ceiling_area,
          room.ceiling_coats,
          room.ceiling_paint_type,
        )
      : 0;

  const total_paint_liters = wall_paint_liters + ceiling_paint_liters;

  // هزینه رنگ دیوار
  const wallPricePerLiter = paintPrices[room.wall_paint_type] ?? 0;
  const wall_paint_cost = wall_paint_liters * wallPricePerLiter;

  // هزینه رنگ سقف
  const ceilPricePerLiter = room.ceiling_paint_type
    ? (paintPrices[room.ceiling_paint_type] ?? 0)
    : 0;
  const ceiling_paint_cost = ceiling_paint_liters * ceilPricePerLiter;

  // هزینه اجرت
  const labor_cost = total_area * laborPricePerSqm;

  return {
    wall_area,
    ceiling_area,
    total_area,
    wall_paint_liters,
    ceiling_paint_liters,
    total_paint_liters,
    wall_paint_cost,
    ceiling_paint_cost,
    labor_cost,
  };
};

const calcAccessoriesCost = (
  paintPrices: PaintPrices,
  total_area: number,
): number => {
  const prices = Object.values(paintPrices).filter(
    (p): p is number => p !== undefined && p > 0,
  );

  if (prices.length === 0) return 0;

  const avgPricePerLiter = prices.reduce((a, b) => a + b, 0) / prices.length;
  const base = avgPricePerLiter * 2;
  const perSqm = (avgPricePerLiter / 30) * total_area;

  return base + perSqm;
};

export const calculateEstimate = (
  rooms: RoomInput[],
  paintPrices: PaintPrices,
  laborPricePerSqm: number,
): EstimateResult => {
  const roomEstimates = rooms.map((room) =>
    calcRoomEstimate(room, paintPrices, laborPricePerSqm),
  );

  const total_area = roomEstimates.reduce((s, r) => s + r.total_area, 0);
  const total_paint_liters = roomEstimates.reduce(
    (s, r) => s + r.total_paint_liters,
    0,
  );
  const total_paint_cost = roomEstimates.reduce(
    (s, r) => s + r.wall_paint_cost + r.ceiling_paint_cost,
    0,
  );
  const total_labor_cost = roomEstimates.reduce((s, r) => s + r.labor_cost, 0);
  const accessories_cost = calcAccessoriesCost(paintPrices, total_area);

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
