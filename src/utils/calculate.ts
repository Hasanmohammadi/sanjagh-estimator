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

const COVERAGE: Record<PaintType, number> = {
  plastic: 10,
  oil: 9,
  acrylic: 12,
};

const WASTE_FACTOR = 1.1;
const SQM_PER_DAY = 53;

// محاسبه قیمت متوسط
const calcAvgPrice = (min?: number, max?: number): number => {
  if (min && max) return (min + max) / 2;
  if (min) return min;
  if (max) return max;
  return 0;
};

// قیمت بدون مصالح هر متر مربع
const getWithoutMaterialsPrice = (paintType: PaintType, config: PriceConfig): number => {
  const min = config[`${paintType}_without_min` as keyof PriceConfig] as number | undefined;
  const max = config[`${paintType}_without_max` as keyof PriceConfig] as number | undefined;
  return calcAvgPrice(min, max);
};

// قیمت رنگ هر متر مربع (از قیمت هر لیتر)
const getPaintCostPerSqm = (paintType: PaintType, config: PriceConfig, coats: number): number => {
  const pricePerLiter = config[`${paintType}_per_liter` as keyof PriceConfig] as number | undefined;
  if (!pricePerLiter) return 0;
  // هزینه رنگ هر متر = (تعداد دست × ۱.۱ × قیمت هر لیتر) / ضریب پوشش
  return (coats * WASTE_FACTOR * pricePerLiter) / COVERAGE[paintType];
};

const calcPaintLiters = (area: number, coats: number, paintType: PaintType): number => {
  return Math.ceil((area * coats * WASTE_FACTOR) / COVERAGE[paintType]);
};

const calcRoomEstimate = (room: RoomInput, config: PriceConfig, withMaterials: boolean): RoomEstimate => {
  const wall_area = 2 * (room.width + room.length) * room.height;
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
  const wall_paint_cost = wall_paint_liters * wallPricePerLiter;

  const ceilPricePerLiter = room.ceiling_paint_type
    ? ((config[`${room.ceiling_paint_type}_per_liter` as keyof PriceConfig] as number) ?? 0)
    : 0;
  const ceiling_paint_cost = ceiling_paint_liters * ceilPricePerLiter;

  // هزینه اجرت (قیمت بدون مصالح هر متر × مساحت × تعداد دست × ۱.۱)
  const wallWithoutPrice = getWithoutMaterialsPrice(room.wall_paint_type, config);
  const wall_labor_cost = wall_area * room.wall_coats * WASTE_FACTOR * wallWithoutPrice;

  let ceiling_labor_cost = 0;
  if (room.ceiling_enabled && room.ceiling_paint_type && room.ceiling_coats) {
    const ceilWithoutPrice = getWithoutMaterialsPrice(room.ceiling_paint_type, config);
    ceiling_labor_cost = ceiling_area * room.ceiling_coats * WASTE_FACTOR * ceilWithoutPrice;
  }

  // اگه with_materials بود، هزینه رنگ رو به اجرت اضافه می‌کنیم
  const wall_total_cost = withMaterials
    ? wall_labor_cost + wall_area * getPaintCostPerSqm(room.wall_paint_type, config, room.wall_coats)
    : wall_labor_cost;

  const ceiling_total_cost =
    withMaterials && room.ceiling_paint_type && room.ceiling_coats
      ? ceiling_labor_cost + ceiling_area * getPaintCostPerSqm(room.ceiling_paint_type, config, room.ceiling_coats)
      : ceiling_labor_cost;

  return {
    wall_area,
    ceiling_area,
    total_area,
    wall_paint_liters,
    ceiling_paint_liters,
    total_paint_liters: wall_paint_liters + ceiling_paint_liters,
    wall_paint_cost,
    ceiling_paint_cost,
    labor_cost: wall_total_cost + ceiling_total_cost,
  };
};

const calcAccessoriesCost = (config: PriceConfig, total_area: number): number => {
  const prices = [config.plastic_per_liter, config.oil_per_liter, config.acrylic_per_liter].filter(
    (p): p is number => p !== undefined && p > 0,
  );

  if (prices.length === 0) return 0;

  const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
  return avg * 2 + (avg / 30) * total_area;
};

export const calculateEstimate = (rooms: RoomInput[], config: PriceConfig, withMaterials: boolean): EstimateResult => {
  const roomEstimates = rooms.map(room => calcRoomEstimate(room, config, withMaterials));

  const total_area = roomEstimates.reduce((s, r) => s + r.total_area, 0);
  const total_paint_liters = roomEstimates.reduce((s, r) => s + r.total_paint_liters, 0);
  const total_paint_cost = roomEstimates.reduce((s, r) => s + r.wall_paint_cost + r.ceiling_paint_cost, 0);
  const total_labor_cost = roomEstimates.reduce((s, r) => s + r.labor_cost, 0);
  const accessories_cost = calcAccessoriesCost(config, total_area);
  const base_cost = total_labor_cost + accessories_cost;
  const days = Math.max(1, Math.ceil(total_area / SQM_PER_DAY));
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
