import express, { Application } from "express";
import cors from "cors";
import projectsRouter from "./routes/projects";
import roomsRouter from "./routes/rooms";
import estimatesRouter from "./routes/estimates";
import settingsRouter from "./routes/settings";
import { errorHandler } from "./utils/apiResponse";
import { authenticate } from "./middlewares/auth";
import priceConfigRouter from "./routes/price-config";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use(authenticate);
app.use("/projects", projectsRouter);
app.use("/projects/:project_id/rooms", roomsRouter);
app.use("/price-config", priceConfigRouter);

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

app.use("/projects/:project_id/estimates", estimatesRouter);

app.use("/settings", settingsRouter);
app.use(errorHandler);

export default app;
