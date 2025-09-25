"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const tache_route_1 = __importDefault(require("./routes/tache.route"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const user_route_1 = __importDefault(require("./routes/user.route")); // Ajoutez cette ligne
require("./taskScheduler"); // juste après les imports Express
const mnPort = 3000;
const mnApp = (0, express_1.default)();
mnApp.use((0, cors_1.default)());
mnApp.use(express_1.default.json());
mnApp.use(express_1.default.urlencoded({ extended: true }));
// Servir les fichiers statiques (images uploadées)
mnApp.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
mnApp.use("/api/taches", tache_route_1.default);
mnApp.use("/api/auth", auth_route_1.default);
mnApp.use("/api/users", user_route_1.default); // Ajoutez cette ligne
mnApp.get("/", (mnReq, mnRes) => {
    mnRes.json({ message: "Bienvenue dans mon API 🚀" });
});
mnApp.listen(mnPort, () => {
    console.log(`✅ Serveur lancé sur http://localhost:${mnPort}`);
});
//point d'entrée de l'app 
//avec extended true objet imbriqué
