import { Router } from "express";
import { 
    getAllDestinations,
    getDestinationByName,
    getHebergementById,
    getPacksByDestination,
    getActivitiesByDestination
} from "../controller/travel.js";

const router = Router();

// afficher les noms de toutes les destinations :
router.get("/destination/all", getAllDestinations);
// chercher une destination par nom :
router.get("/destination/:name", getDestinationByName);
// chercher un hébérgement par nom :
router.get("/hebergement/:id", getHebergementById);
// chercher tous les packs par destination :
router.get("/pack/:id", getPacksByDestination);
// chercher tous les packs par destination :
router.get("/activities/:id", getActivitiesByDestination);

export default router;