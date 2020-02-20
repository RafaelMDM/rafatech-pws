import { Request, Response, NextFunction } from "express";
import { IPost } from "../db/Post";
import BlogService from "../services/BlogService";

class BlogController {
  async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      if (!isPost(req.body))  return next();

      const post = await BlogService.create(req.body);
      return res.status(201).send(post);
    } catch (err) {
      console.error(err);
      return res.sendStatus(500);
    }
  }

  async list(req: Request, res: Response): Promise<Response> {
    try {
      const posts = await BlogService.list(req.body.tags);

      return res.status(200).send(posts);
    } catch (err) {
      console.error(err);
      return res.sendStatus(500);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { id } = req.body;
      if (id)  req.body._id = id;
      if (!isPost(req.body))  return next();

      const changedPost = await BlogService.update(req.body);
      if (changedPost)  return res.status(200).send(changedPost);
      return res.sendStatus(204);
    } catch (err) {
      console.error(err);
      return res.sendStatus(500);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { id } = req.body;
      if (id)  req.body._id = id;
      if (!isPost(req.body))  return next();

      const removedPost = await BlogService.remove(req.body._id);
      if (removedPost)  return res.status(200).send(removedPost);
      return res.sendStatus(204);
    } catch (err) {
      console.error(err);
      return res.sendStatus(500);
    }
  }
}

function isPost(object: any): object is IPost {
  return '_id' in object || (
    'author' in object &&
    'title' in object
  )
}

export default new BlogController();
