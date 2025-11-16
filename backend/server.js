import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Тест маршруты
app.get("/api", (req, res) => {
  res.json({ message: "Backend жұмыс істеп тұр!" });
});

app.listen(PORT, () => {
  console.log(`✅ Сервер http://localhost:${PORT} портында жұмыс істеп тұр`);
});
