import express from "express";
import dotenv from "dotenv";

import { routes } from "./src/task/task.route.js";

dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 4000;

// app.use("/tasks", router)
app.use("/api/tasks", routes);

app.listen(PORT, () => {
  console.log(`Server is listening on Port ${PORT}`);
});
