import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repositorie';
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';

export class UserService {
  private userRepo = new UserRepository();

  async login(login: string, password: string) {
    const user = await this.userRepo.verifyPassword(login, password);
    if (!user) return null;

    const payload = {
      userId: user.id,
      login: user.login,
      role: user.role,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

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

  async register(data: {
    nom: string;
    prenom: string;
    login: string;
    password: string;
    role?: 'ADMIN' | 'USER';
  }) {
    return this.userRepo.createUser(data);
  }

  verifyToken(token: string) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch {
      return null;
    }
  }

  async getAllUsers() {
    return this.userRepo.findAll();
  }
}
