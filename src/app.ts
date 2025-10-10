import compression from "compression";
import cors from "cors";
import express from "express";
import router from "./app/routes/routes";

const app = express();

app.use(cors());
app.use(compression());
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.get("/", (_req, res) => {
  res.send("API is running");
});

app.use("/api/v1", router);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

export default app;
