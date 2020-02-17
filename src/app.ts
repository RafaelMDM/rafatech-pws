import dotenv from "dotenv-safe";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import routes from "./routes";
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
    const db_server = (process.env.NODE_ENV === 'production') ? process.env.MONGO_SRV : 'localhost';
    mongoose.connect(`mongodb://${db_server}:27017/rafatech-pws`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
  }

  private routes (): void {
    this.express.use(routes);
  }
}

export default new App().express;
