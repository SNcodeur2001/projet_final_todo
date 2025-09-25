"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
class UserRepository {
    async findByLogin(login) {
        return prisma.user.findUnique({
            where: { login },
        });
    }
    async findById(id) {
        return prisma.user.findUnique({
            where: { id },
        });
    }
    async createUser(data) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        return prisma.user.create({
            data: {
                nom: data.nom,
                prenom: data.prenom,
                login: data.login,
                password: hashedPassword,
                role: data.role || 'USER',
            },
        });
    }
    async verifyPassword(login, plainPassword) {
        const user = await this.findByLogin(login);
        if (!user)
            return null;
        const isMatch = await bcrypt.compare(plainPassword, user.password);
        return isMatch ? user : null;
    }
    async findAll() {
        return prisma.user.findMany();
    }
}
exports.UserRepository = UserRepository;
