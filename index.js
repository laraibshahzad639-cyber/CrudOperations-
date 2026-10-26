import express from "express";
import dotenv from "dotenv";

import { routes } from "./src/task/task.route.js";
import { notFoundMiddleware } from "./src/middleware/notfound.middleeware.js";
import { errorhandlerMiddleware } from "./src/middleware/errorhandler.middleware.js";

dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 4000;

// app.use("/tasks", router)
app.use("/api/tasks", routes);
app.use(notFoundMiddleware);
app.use(errorhandlerMiddleware);
app.listen(PORT, () => {
  console.log(`Server is listening on Port ${PORT}`);
});
