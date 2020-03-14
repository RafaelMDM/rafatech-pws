import { Request, Response, NextFunction } from "express";
import { IProject } from "../db/Project";
import { successResponse, failureResponse } from '../utils';
import ProjectService from "../services/ProjectService";

class ProjectController {
  async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      if (!isProject(req.body))  return next();

      const project = await ProjectService.create(req.body);
      const report = successResponse(project);
      return res.status(201).send(report);
    } catch (err) {
      const report = failureResponse(err.message);
      return res.status(500).send(report);
    }
  }

  async list(req: Request, res: Response): Promise<Response> {
    try {
      const projects = await ProjectService.list(req.body.tags);

      const report = successResponse(projects);
      return res.status(201).send(report);
    } catch (err) {
      const report = failureResponse(err.message);
      return res.status(500).send(report);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      if (!isProject(req.body))  return next();
      req.body._id = req.body.id;

      const changedProject = await ProjectService.update(req.body);
      const report = successResponse(changedProject);
      const status = (changedProject) ? 200 : 204;
      return res.status(status).send(report);
    } catch (err) {
      const report = failureResponse(err.message);
      return res.status(500).send(report);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      if (!isProject(req.body))  return next();
      const { id } = req.body;

      const removedProject = await ProjectService.remove(id);
      const report = successResponse(removedProject);
      const status = (removedProject) ? 200 : 204;
      return res.status(status).send(report);
    } catch (err) {
      const report = failureResponse(err.message);
      return res.status(500).send(report);
    }
  }
}

function isProject(object: any): object is IProject & { id: string } {
  return 'id' in object || (
    'name' in object &&
    'license' in object
  )
}

export default new ProjectController();
