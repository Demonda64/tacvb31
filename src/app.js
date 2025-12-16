import express from "express";
import pagesRoutes from "./routes/api/pages.routes.js";

const app = express();
app.use(express.json());

app.use("/api", pagesRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "INTERNAL_ERROR" });
});

export default app;
