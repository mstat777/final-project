import { Router } from "express";
import { 
    getAllContinentsAndDestinations,
    getAllContinents,
    getAllDestinations,
    getDestinationByName,
    getImagesDestination,
    getImagesLodging,
    getHebergementById,
    getPacksByDestination,
    getActivitiesByDestination,
    getBestPromoPack,
    getTopDestination
} from "../controller/travel.js";

const router = Router();

// afficher toutes les destinations avec le continent :
router.get("/destination/all-with-continent", getAllContinentsAndDestinations);
// afficher tous les continents :
router.get("/continent/all", getAllContinents);
// afficher toutes les destinations :
router.get("/destination/all", getAllDestinations);
// afficher la "Top" destination (la plus réservée) :
router.get("/destination/top-offer", getTopDestination);
// chercher une destination par nom :
router.get("/destination/:name", getDestinationByName);
// chercher toutes les images de la destination :
router.get("/destination/img/all/:id", getImagesDestination);
// chercher toutes les images de l'hébérgement :
router.get("/lodging/img/all/:id", getImagesLodging);
// chercher un hébérgement par ID :
router.get("/lodging/:id", getHebergementById);
// chercher le pack "Best Promo" (celui avec la plus grande réduction) :
router.get("/pack/best-promo", getBestPromoPack);
// chercher un pack par ID de destination :
router.get("/pack/:id", getPacksByDestination);
// chercher une activité par ID de destination :
router.get("/activities/:id", getActivitiesByDestination);

export default router;