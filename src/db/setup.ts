import { createEnums } from "./enums";
import createTables from "./schema";

export default async function setupDatabase(): Promise<void> {
  await createEnums();
  await createTables();
}
