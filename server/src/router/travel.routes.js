import { Router } from "express";
import { 
    getAllDestinations,
    getDestinationByName,
    getImagesDestination,
    getHebergementById,
    getPacksByDestination,
    getActivitiesByDestination
} from "../controller/travel.js";

const router = Router();

// afficher les noms de toutes les destinations :
router.get("/destination/all", getAllDestinations);
// chercher une destination par nom :
router.get("/destination/:name", getDestinationByName);
// chercher toutes les images de la destination :
router.get("/destination/img/all/:id", getImagesDestination);
// chercher un hébérgement par ID :
router.get("/lodging/:id", getHebergementById);
// chercher un pack par ID de destination :
router.get("/pack/:id", getPacksByDestination);
// chercher une activité par ID de destination :
router.get("/activities/:id", getActivitiesByDestination);

export default router;