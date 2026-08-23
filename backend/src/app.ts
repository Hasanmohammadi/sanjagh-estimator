import express, { Application, Request, Response } from "express";
import cors from "cors";
import projectsRouter from "./routes/projects";
import draftRoomRoutes from "./routes/draft-room.routes";
import estimatesRouter from "./routes/estimates.routes";
import settingsRouter from "./routes/settings";
import { errorHandler } from "./utils/apiResponse";
import { authenticate } from "./middlewares/auth";
import priceConfigRouter from "./routes/price-config";
import draftRouter from "./routes/draft";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use(authenticate);
app.use("/projects", projectsRouter);
app.use("/draft", draftRouter);

app.use("/draft/rooms", draftRoomRoutes);

app.use("/price-config", priceConfigRouter);

app.use("/projects/:project_id/estimates", estimatesRouter);

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.use("/settings", settingsRouter);
app.use(errorHandler);

export default app;
