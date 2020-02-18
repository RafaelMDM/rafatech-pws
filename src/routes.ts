import { Router } from "express";
import ProjectController from "./controllers/ProjectController";

const routes = Router();

routes.get('/projects', ProjectController.list);
routes.post('/projects', ProjectController.create);
routes.put('/projects', ProjectController.update);
routes.delete('/projects', ProjectController.remove);

export default routes;
