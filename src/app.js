import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import adminRoutes from "./routes/api/admin.routes.js";
import pagesRoutes from "./routes/api/pages.routes.js";



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// ✅ servir les fichiers statiques
app.use(express.static(path.join(__dirname, "public")));

// ✅ API
app.use("/api", adminRoutes);
app.use("/api", pagesRoutes);


// ✅ homepage -> index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// handler d'erreurs
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "INTERNAL_ERROR" });
});

export default app;
