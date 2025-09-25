import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();

export class UserRepository {
  async findByLogin(login: string) {
    return prisma.user.findUnique({
      where: { login },
    });
  }

  async findById(id: number) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async createUser(data: {
    nom: string;
    prenom: string;
    login: string;
    password: string;
    role?: 'ADMIN' | 'USER';
  }) {
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

  async verifyPassword(login: string, plainPassword: string) {
    const user = await this.findByLogin(login);
    if (!user) return null;

    const isMatch = await bcrypt.compare(plainPassword, user.password);
    return isMatch ? user : null;
  }
  
  async findAll(){
    return prisma.user.findMany();
  }
}
