import { toJalaali } from "jalaali-js";

export function formatJalaliDate(dateString: string): string {
  const date = new Date(dateString);

  const { jy, jm, jd } = toJalaali(date.getFullYear(), date.getMonth() + 1, date.getDate());

  return `${jy}/${String(jm).padStart(2, "0")}/${String(jd).padStart(2, "0")}`;
}
