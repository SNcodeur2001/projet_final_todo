"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_repositorie_1 = require("../repositories/user.repositorie");
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';
class UserService {
    constructor() {
        this.userRepo = new user_repositorie_1.UserRepository();
    }
    async login(login, password) {
        const user = await this.userRepo.verifyPassword(login, password);
        if (!user)
            return null;
        const payload = {
            userId: user.id,
            login: user.login,
            role: user.role,
        };
        const token = jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: '1h' });
        return {
            token,
            user: {
                id: user.id,
                nom: user.nom,
                prenom: user.prenom,
                login: user.login,
                role: user.role,
            },
        };
    }
    async register(data) {
        return this.userRepo.createUser(data);
    }
    verifyToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, JWT_SECRET);
        }
        catch {
            return null;
        }
    }
    async getAllUsers() {
        return this.userRepo.findAll();
    }
}
exports.UserService = UserService;
