import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { mnLoginSchema, mnCreateUserSchema } from "../validators/auth.validator";

const mnUserService = new UserService();

export class AuthController {
  private async handleRequest(
    res: Response,
    callback: () => Promise<any>,
    successStatus = 200
  ) {
    try {
      const data = await callback();
      res.status(successStatus).json({ status: "success", data });
    } catch (mnError: any) {
      res.status(400).json({ status: "error", message: mnError.message });
    }
  }

  login(req: Request, res: Response) {
    return this.handleRequest(res, async () => {
      const { login, password } = mnLoginSchema.parse(req.body);
      const result = await mnUserService.login(login, password);
      if (!result) throw new Error("Identifiants invalides");
      return result;
    });
  }

  register(req: Request, res: Response) {
    return this.handleRequest(res, async () => {
      const data = mnCreateUserSchema.parse(req.body);
      return await mnUserService.register(data);
    }, 201);
  }

  verify(req: Request, res: Response) {
    return this.handleRequest(res, async () => {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) throw new Error("Token manquant");
      const payload = mnUserService.verifyToken(token);
      if (!payload) throw new Error("Token invalide");
      return payload;
    });
  }
}
