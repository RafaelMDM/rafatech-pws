import { Request, Response, NextFunction } from "express";
import { IProject } from "../db/Project";
import ProjectService from "../services/ProjectService";

class ProjectController {
  async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      if (!isProject(req.body))  return next();

      const project = await ProjectService.create(req.body);
      return res.status(201).send(project);
    } catch (err) {
      console.error(err);
      return res.sendStatus(500);
    }
  }

  async list(req: Request, res: Response): Promise<Response> {
    try {
      const projects = await ProjectService.list(req.body.tags);

      return res.status(200).send(projects);
    } catch (err) {
      console.error(err);
      return res.sendStatus(500);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { id } = req.body;
      if (id)  req.body._id = id;
      if (!isProject(req.body))  return next();

      const changedProject = await ProjectService.update(req.body);
      if (changedProject)  return res.status(200).send(changedProject);
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
      if (!isProject(req.body))  return next();

      const removedProject = await ProjectService.remove(req.body._id);
      if (removedProject)  return res.status(200).send(removedProject);
      return res.sendStatus(204);
    } catch (err) {
      console.error(err);
      return res.sendStatus(500);
    }
  }
}

function isProject(object: any): object is IProject {
  return '_id' in object || (
    'name' in object &&
    'license' in object
  )
}

export default new ProjectController();
