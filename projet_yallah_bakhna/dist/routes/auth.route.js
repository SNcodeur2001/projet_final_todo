"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const mnRouter = (0, express_1.Router)();
const mnController = new auth_controller_1.AuthController();
mnRouter.post("/login", mnController.login.bind(mnController));
mnRouter.post("/register", mnController.register.bind(mnController));
mnRouter.get("/verify", mnController.verify.bind(mnController));
exports.default = mnRouter;
//le createur de la tache peut attribuer a un autre de pouvoir modifier via un endpoint oude faire tout ajout piece jointe encoder image une mettre quelque part dans le projet et faire le url dans la base de données
