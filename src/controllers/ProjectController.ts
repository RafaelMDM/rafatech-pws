import { Request, Response } from "express";
import ProjectService from "../services/ProjectService";

class ProjectController {
  async create(req: Request, res: Response, next: any) {
    try {
      if (Object.entries(req.body).length === 0)  return next();

      const project = await ProjectService.create(req.body);
      res.status(201).send(project);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  }

  async list(req: Request, res: Response) {
    try {
      const projects = await ProjectService.list(req.body?.tags);

      res.status(200).send(projects);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  }

  async update(req: Request, res: Response, next: any) {
    try {
      if (Object.entries(req.body).length === 0)  return next();

      const changed = await ProjectService.update(req.body);
      if (changed)  return res.sendStatus(200);
      res.sendStatus(204);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  }

  async remove(req: Request, res: Response, next: any) {
    try {
      if (!req.body?.id)  return next();

      await ProjectService.remove(req.body.id);
      res.sendStatus(200);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  }
}

export default new ProjectController();
