import express from "express";
import path from "path";
import cors from "cors";
import mnRouter from "./routes/tache.route";
import mnRouter1 from "./routes/auth.route";
import mnUserRouter from "./routes/user.route"; // Ajoutez cette ligne
import './taskScheduler'; // juste après les imports Express

const mnPort = 3000;
const mnApp = express();
mnApp.use(cors());
mnApp.use(express.json());
mnApp.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques (images uploadées)
mnApp.use('/uploads', express.static(path.join(__dirname, '../uploads')));

mnApp.use("/api/taches",mnRouter)
mnApp.use("/api/auth", mnRouter1);
mnApp.use("/api/users", mnUserRouter); // Ajoutez cette ligne
mnApp.get("/", (mnReq, mnRes) => {
  mnRes.json({ message: "Bienvenue dans mon API 🚀" });
});

mnApp.listen(mnPort, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${mnPort}`);
});


//point d'entrée de l'app 

//avec extended true objet imbriqué