"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const user_service_1 = require("../services/user.service");
const auth_validator_1 = require("../validators/auth.validator");
const mnUserService = new user_service_1.UserService();
class AuthController {
    async handleRequest(res, callback, successStatus = 200) {
        try {
            const data = await callback();
            res.status(successStatus).json({ status: "success", data });
        }
        catch (mnError) {
            res.status(400).json({ status: "error", message: mnError.message });
        }
    }
    login(req, res) {
        return this.handleRequest(res, async () => {
            const { login, password } = auth_validator_1.mnLoginSchema.parse(req.body);
            const result = await mnUserService.login(login, password);
            if (!result)
                throw new Error("Identifiants invalides");
            return result;
        });
    }
    register(req, res) {
        return this.handleRequest(res, async () => {
            const data = auth_validator_1.mnCreateUserSchema.parse(req.body);
            return await mnUserService.register(data);
        }, 201);
    }
    verify(req, res) {
        return this.handleRequest(res, async () => {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token)
                throw new Error("Token manquant");
            const payload = mnUserService.verifyToken(token);
            if (!payload)
                throw new Error("Token invalide");
            return payload;
        });
    }
}
exports.AuthController = AuthController;
