import { PaintType, PaintTypeDic, RoomType, RoomTypeDic } from "@/api/services/draft-rooms";

export const ROOM_TYPES = [
  { title: RoomTypeDic.bedroom, value: RoomType.Bedroom },
  { title: RoomTypeDic.living_room, value: RoomType.LivingRoom },
  { title: RoomTypeDic.bathroom, value: RoomType.Bathroom },
  { title: RoomTypeDic.kitchen, value: RoomType.Kitchen },
  { title: RoomTypeDic.other, value: RoomType.Other },
  { title: RoomTypeDic.hallway, value: RoomType.Hallway },
];

export const PAINT_TYPES = [
  { title: PaintTypeDic.acrylic, value: PaintType.Acrylic },
  { title: PaintTypeDic.oil, value: PaintType.Oil },
  { title: PaintTypeDic.plastic, value: PaintType.Plastic },
];
