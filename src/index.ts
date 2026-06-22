import "dotenv/config";
import createTables from "./db/schema";
import app from "./app";

const PORT = process.env.PORT || 3001;

const start = async (): Promise<void> => {
  await createTables();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
