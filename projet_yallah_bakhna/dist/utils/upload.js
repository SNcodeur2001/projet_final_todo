"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFileUrl = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Configuration du stockage
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, "uploads/images/");
        }
        else if (file.mimetype.startsWith("audio/")) {
            cb(null, "uploads/audio/");
        }
        else {
            cb(new Error("Type de fichier non supporté !"), "");
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const extension = path_1.default.extname(file.originalname);
        cb(null, file.fieldname + "-" + uniqueSuffix + extension);
    },
});
// Filtre pour les types de fichiers autorisés
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("audio/")) {
        cb(null, true);
    }
    else {
        cb(new Error("Seuls les fichiers image ou audio sont autorisés !"));
    }
};
// Configuration multer
exports.upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 20 * 1024 * 1024, // Limite de 20MB (audio peut être lourd)
    },
    fileFilter: fileFilter,
});
// Générer l’URL du fichier
const generateFileUrl = (filename, type) => {
    return `/uploads/${type}/${filename}`;
};
exports.generateFileUrl = generateFileUrl;
