import { Request, Response, NextFunction } from "express";
import { IPost } from "../db/Post";
import { successResponse, failureResponse } from '../utils';
import BlogService from "../services/BlogService";

class BlogController {
  async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      if (!isPost(req.body))  return next();

      const post = await BlogService.create(req.body);
      const report = successResponse(post);
      return res.status(201).send(report);
    } catch (err) {
      const report = failureResponse(err.message);
      return res.status(500).send(report);
    }
  }

  async list(req: Request, res: Response): Promise<Response> {
    try {
      const posts = await BlogService.list(req.body.tags);

      const report = successResponse(posts);
      return res.status(200).send(report);
    } catch (err) {
      const report = failureResponse(err.message);
      return res.status(500).send(report);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      if (!isPost(req.body))  return next();
      req.body._id = req.body.id;

      const changedPost = await BlogService.update(req.body);
      const report = successResponse(changedPost);
      const status = (changedPost) ? 200 : 204;
      return res.status(status).send(report);
    } catch (err) {
      const report = failureResponse(err.message);
      return res.status(500).send(report);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      if (!isPost(req.body))  return next();
      const { id } = req.body;

      const removedPost = await BlogService.remove(id);
      const report = successResponse(removedPost);
      const status = (removedPost) ? 200 : 204;
      return res.status(status).send(report);
    } catch (err) {
      const report = failureResponse(err.message);
      return res.status(500).send(report);
    }
  }
}

function isPost(object: any): object is IPost & { id: string } {
  return 'id' in object || (
    'author' in object &&
    'title' in object
  )
}

export default new BlogController();
