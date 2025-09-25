import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const mnRouter = Router();
const mnController = new AuthController();

mnRouter.post("/login", mnController.login.bind(mnController));
mnRouter.post("/register", mnController.register.bind(mnController));
mnRouter.get("/verify", mnController.verify.bind(mnController)); 

export default mnRouter;


//le createur de la tache peut attribuer a un autre de pouvoir modifier via un endpoint oude faire tout ajout piece jointe encoder image une mettre quelque part dans le projet et faire le url dans la base de données