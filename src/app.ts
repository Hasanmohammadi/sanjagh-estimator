import express, { Application, Request, Response } from "express";
import cors from "cors";
import projectsRouter from "./routes/projects";
import roomsRouter from "./routes/rooms";
import estimatesRouter from "./routes/estimates";
import { errorHandler } from "./utils/apiResponse";
import { authenticate } from "./middlewares/auth";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use(authenticate);
app.use("/projects", projectsRouter);
app.use("/projects/:project_id/rooms", roomsRouter);

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.use("/projects/:project_id/estimates", estimatesRouter);
app.use(errorHandler);

export default app;
