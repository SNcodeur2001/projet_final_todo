import { PrismaClient } from "@prisma/client";
import { generateFileUrl } from "../utils/upload";

const prisma = new PrismaClient();

export class AttachmentService {
  async createAttachment(data: {
    tacheId: number;
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
  }) {
    const type: "image" | "audio" = data.mimetype.startsWith("image/") ? "image" : "audio";
    const url = generateFileUrl(data.filename, type);

    return prisma.tacheAttachment.create({
      data: {
        ...data,
        url
      }
    });
  }

  async getAttachmentsByTacheId(tacheId: number) {
    return prisma.tacheAttachment.findMany({
      where: { tacheId }
    });
  }

  async deleteAttachment(id: number) {
    return prisma.tacheAttachment.delete({
      where: { id }
    });
  }

  async getAttachmentById(id: number) {
    return prisma.tacheAttachment.findUnique({
      where: { id }
    });
  }
}