import { Request, Response } from "express";
import { UserService } from "../services/user.service";

const mnUserService = new UserService();

export class UserController {
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await mnUserService.getAllUsers();
      res.status(200).json({
        status: "success",
        data: users
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message
      });
    }
  }
}