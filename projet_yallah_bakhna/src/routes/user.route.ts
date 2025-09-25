import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";

const mnRouter = Router();
const mnController = new UserController();

mnRouter.use(authenticateJWT);
mnRouter.get("/", mnController.getAllUsers.bind(mnController));

export default mnRouter;