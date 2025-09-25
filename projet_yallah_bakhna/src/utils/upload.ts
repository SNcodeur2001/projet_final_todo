import multer from "multer";
import path from "path";
import { Request } from "express";

// Configuration du stockage
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, "uploads/images/");
    } else if (file.mimetype.startsWith("audio/")) {
      cb(null, "uploads/audio/");
    } else {
      cb(new Error("Type de fichier non supporté !"), "");
    }
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + extension);
  },
});

// Filtre pour les types de fichiers autorisés
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("audio/")) {
    cb(null, true);
  } else {
    cb(new Error("Seuls les fichiers image ou audio sont autorisés !"));
  }
};

// Configuration multer
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // Limite de 20MB (audio peut être lourd)
  },
  fileFilter: fileFilter,
});

// Générer l’URL du fichier
export const generateFileUrl = (filename: string, type: "image" | "audio"): string => {
  return `/uploads/${type}/${filename}`;
};
