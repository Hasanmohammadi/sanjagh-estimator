import "dotenv/config";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import createTables from "./db/schema";
import projectsRouter from "./routes/projects";
import roomsRouter from "./routes/rooms";
import { errorHandler } from "./utils/apiResponse";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use("/projects", projectsRouter);
app.use("/projects/:project_id/rooms", roomsRouter);

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

//-------MIDDLEWARE-------
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

const start = async (): Promise<void> => {
  await createTables();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
