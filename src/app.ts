import express from "express";
import dotenv from "dotenv-safe";
import routes from "./routes";

const env = dotenv.config();
const PORT = (process.env.NODE_ENV === 'production') ? process.env.PORT : 3001;
const app = express();

app.use(express.json());
app.use(routes);

app.listen(PORT);

export default app;
