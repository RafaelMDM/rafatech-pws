import { Router } from "express";
import ProjectController from "../controllers/ProjectController";
import BlogController from "../controllers/BlogController";
import MessageController from "../controllers/MessageController";

const routes = Router();

routes.post('/projects', ProjectController.create);
routes.put('/projects', ProjectController.update);
routes.delete('/projects', ProjectController.remove);

routes.post('/blog', BlogController.create);
routes.put('/blog', BlogController.update);
routes.delete('/blog', BlogController.remove);

routes.get('/mail', MessageController.list);
routes.post('/mail', MessageController.send);

export default routes;
