import { Router } from "express";
import ProjectController from "../controllers/ProjectController";
import BlogController from "../controllers/BlogController";
import LoginController from "../controllers/LoginController";

const routes = Router();

routes.post('/register', LoginController.register);
routes.post('/login', LoginController.login);

routes.get('/projects', ProjectController.list);

routes.get('/blog', BlogController.list);

export default routes;
