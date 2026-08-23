export type PaintType = "plastic" | "oil" | "acrylic";

export interface PriceConfig {
  plastic_per_liter?: number;
  oil_per_liter?: number;
  acrylic_per_liter?: number;
  plastic_without_min?: number;
  plastic_without_max?: number;
  oil_without_min?: number;
  oil_without_max?: number;
  acrylic_without_min?: number;
  acrylic_without_max?: number;
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
  wall_labor_cost: number;
  ceiling_labor_cost: number;
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
  min_total_price: number;
  max_total_price: number;
}

const COVERAGE: Record<PaintType, number> = {
  plastic: 10,
  oil: 9,
  acrylic: 12,
};

const WASTE_FACTOR = 1.1;
const SQM_PER_DAY = 53;

const calcAvgPrice = (min?: number, max?: number): number => {
  if (min && max) return (min + max) / 2;
  if (min) return min;
  if (max) return max;
  return 0;
};

const getAvgLaborPrice = (paintType: PaintType, config: PriceConfig): number => {
  const min = config[`${paintType}_without_min` as keyof PriceConfig] as number | undefined;
  const max = config[`${paintType}_without_max` as keyof PriceConfig] as number | undefined;
  return calcAvgPrice(min, max);
};

const calcPaintLiters = (area: number, coats: number, paintType: PaintType): number => {
  return Math.ceil((area * coats * WASTE_FACTOR) / COVERAGE[paintType]);
};

const calcRoomEstimate = (room: RoomInput, config: PriceConfig): RoomEstimate => {
  const wall_area = 2 * (room.length + room.width) * room.height;
  const ceiling_area = room.ceiling_enabled ? room.width * room.length : 0;
  const total_area = wall_area + ceiling_area;

  // لیتر رنگ
  const wall_paint_liters = calcPaintLiters(wall_area, room.wall_coats, room.wall_paint_type);
  const ceiling_paint_liters =
    room.ceiling_enabled && room.ceiling_paint_type && room.ceiling_coats
      ? calcPaintLiters(ceiling_area, room.ceiling_coats, room.ceiling_paint_type)
      : 0;

  // هزینه رنگ (لیتر × قیمت هر لیتر)
  const wallPricePerLiter = (config[`${room.wall_paint_type}_per_liter` as keyof PriceConfig] as number) ?? 0;
  const wall_paint_cost = Math.round(wall_paint_liters * wallPricePerLiter);

  const ceilPricePerLiter = room.ceiling_paint_type
    ? ((config[`${room.ceiling_paint_type}_per_liter` as keyof PriceConfig] as number) ?? 0)
    : 0;
  const ceiling_paint_cost = Math.round(ceiling_paint_liters * ceilPricePerLiter);

  const wallLaborPrice = getAvgLaborPrice(room.wall_paint_type, config);
  const wall_labor_cost = Math.round(wall_area * room.wall_coats * WASTE_FACTOR * wallLaborPrice);

  let ceiling_labor_cost = 0;
  if (room.ceiling_enabled && room.ceiling_paint_type && room.ceiling_coats) {
    const ceilLaborPrice = getAvgLaborPrice(room.ceiling_paint_type, config);
    ceiling_labor_cost = Math.round(ceiling_area * room.ceiling_coats * WASTE_FACTOR * ceilLaborPrice);
  }

  return {
    wall_area,
    ceiling_area,
    total_area,
    wall_paint_liters,
    ceiling_paint_liters,
    total_paint_liters: wall_paint_liters + ceiling_paint_liters,
    wall_paint_cost,
    ceiling_paint_cost,
    wall_labor_cost,
    ceiling_labor_cost,
  };
};

const calcAccessoriesCost = (config: PriceConfig, total_area: number, usedPaintTypes: Set<PaintType>): number => {
  // فقط قیمت رنگ‌هایی که استفاده شدن
  const prices = Array.from(usedPaintTypes)
    .map(type => config[`${type}_per_liter` as keyof PriceConfig] as number | undefined)
    .filter((p): p is number => p !== undefined && p > 0);

  if (prices.length === 0) return 0;

  const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
  return Math.round(avg * 2 + (avg / 30) * total_area);
};

export const calculateEstimate = (rooms: RoomInput[], config: PriceConfig): EstimateResult => {
  const roomEstimates = rooms.map(room => calcRoomEstimate(room, config));

  const total_area = roomEstimates.reduce((s, r) => s + r.total_area, 0);
  const total_paint_liters = roomEstimates.reduce((s, r) => s + r.total_paint_liters, 0);
  const total_paint_cost = roomEstimates.reduce((s, r) => s + r.wall_paint_cost + r.ceiling_paint_cost, 0);
  const total_labor_cost = roomEstimates.reduce((s, r) => s + r.wall_labor_cost + r.ceiling_labor_cost, 0);

  const usedPaintTypes = new Set<PaintType>(
    rooms.flatMap(r => [
      r.wall_paint_type,
      ...(r.ceiling_enabled && r.ceiling_paint_type ? [r.ceiling_paint_type] : []),
    ]),
  );

  const accessories_cost = calcAccessoriesCost(config, total_area, usedPaintTypes);

  const base_cost = total_paint_cost + total_labor_cost + accessories_cost;

  const days = Math.max(1, Math.ceil(total_area / SQM_PER_DAY));
  const min_price = base_cost * 0.8;
  const max_price = base_cost * 1.2;

  let min_labor = 0;
  let max_labor = 0;

  rooms.forEach(room => {
    const wallMin = (config[`${room.wall_paint_type}_without_min` as keyof PriceConfig] as number) ?? 0;
    const wallMax = (config[`${room.wall_paint_type}_without_max` as keyof PriceConfig] as number) ?? 0;
    const wallArea = 2 * (room.width + room.length) * room.height;

    min_labor += Math.round(wallArea * room.wall_coats * WASTE_FACTOR * wallMin);
    max_labor += Math.round(wallArea * room.wall_coats * WASTE_FACTOR * wallMax);

    if (room.ceiling_enabled && room.ceiling_paint_type && room.ceiling_coats) {
      const ceilMin = (config[`${room.ceiling_paint_type}_without_min` as keyof PriceConfig] as number) ?? 0;
      const ceilMax = (config[`${room.ceiling_paint_type}_without_max` as keyof PriceConfig] as number) ?? 0;
      const ceilArea = room.width * room.length;

      min_labor += Math.round(ceilArea * room.ceiling_coats * WASTE_FACTOR * ceilMin);
      max_labor += Math.round(ceilArea * room.ceiling_coats * WASTE_FACTOR * ceilMax);
    }
  });

  const total_materials_cost = total_paint_cost + accessories_cost;

  const min_total_price = min_labor + total_materials_cost;
  const max_total_price = max_labor + total_materials_cost;

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
    min_total_price,
    max_total_price,
  };
};
