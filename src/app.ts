import dotenv from "dotenv-safe";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import tokenVerifier from "./controllers/TokenController";
import secureRoutes from "./routes/secure";
import publicRoutes from "./routes/public";
dotenv.config();

class App {
  public express: express.Application;

  public constructor () {
    this.express = express();

    this.middlewares();
    this.database();
    this.routes();
  }

  private middlewares (): void {
    this.express.use(express.json());
    this.express.use(cors());
  }

  private database (): void {
    const db_server = (process.env.NODE_ENV === 'production') ? process.env.MONGO_SRV : 'mongodb://localhost:27017/rafatech-pws';
    mongoose.connect(db_server, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
  }

  private routes (): void {
    this.express.use(publicRoutes);
    this.express.use(tokenVerifier);
    this.express.use(secureRoutes);
  }
}

export default new App().express;
