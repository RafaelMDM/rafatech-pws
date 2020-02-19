import { Request, Response, NextFunction } from "express";
import BlogService from "../services/BlogService";

class BlogController {
  async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      return res.sendStatus(501);
    } catch (err) {
      console.error(err);
      return res.sendStatus(500);
    }
  }

  async list(req: Request, res: Response): Promise<Response> {
    try {
      return res.sendStatus(501);
    } catch (err) {
      console.error(err);
      return res.sendStatus(500);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      return res.sendStatus(501);
    } catch (err) {
      console.error(err);
      return res.sendStatus(500);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      return res.sendStatus(501);
    } catch (err) {
      console.error(err);
      return res.sendStatus(500);
    }
  }
}

export default new BlogController();
