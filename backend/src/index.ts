import "dotenv/config";
import app from "./app";
import setupDatabase from "./db/setup";

const PORT = process.env.PORT || 3001;

const start = async (): Promise<void> => {
  try {
    await setupDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

start();
