import express, { Express } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import * as database from "./config/database";
import clientV1Routes from "./api/v1/routes/client/index.route";
import adminV1Routes from "./api/v1/routes/admin/index.route";

dotenv.config();
database.connect();

const app: Express = express();
const port: number | string = process.env.PORT || 3000;

// Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(cors());

// Cookie Parser (for JWT refresh tokens)
app.use(cookieParser(process.env.TRAVELLAND_SECRET));

// API Routes
clientV1Routes(app);
adminV1Routes(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});