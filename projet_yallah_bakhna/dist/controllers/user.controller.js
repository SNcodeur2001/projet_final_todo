"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("../services/user.service");
const mnUserService = new user_service_1.UserService();
class UserController {
    async getAllUsers(req, res) {
        try {
            const users = await mnUserService.getAllUsers();
            res.status(200).json({
                status: "success",
                data: users
            });
        }
        catch (error) {
            res.status(400).json({
                status: "error",
                message: error.message
            });
        }
    }
}
exports.UserController = UserController;
