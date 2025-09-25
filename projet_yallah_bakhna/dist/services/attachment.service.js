"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentService = void 0;
const client_1 = require("@prisma/client");
const upload_1 = require("../utils/upload");
const prisma = new client_1.PrismaClient();
class AttachmentService {
    async createAttachment(data) {
        const type = data.mimetype.startsWith("image/") ? "image" : "audio";
        const url = (0, upload_1.generateFileUrl)(data.filename, type);
        return prisma.tacheAttachment.create({
            data: {
                ...data,
                url
            }
        });
    }
    async getAttachmentsByTacheId(tacheId) {
        return prisma.tacheAttachment.findMany({
            where: { tacheId }
        });
    }
    async deleteAttachment(id) {
        return prisma.tacheAttachment.delete({
            where: { id }
        });
    }
    async getAttachmentById(id) {
        return prisma.tacheAttachment.findUnique({
            where: { id }
        });
    }
}
exports.AttachmentService = AttachmentService;
