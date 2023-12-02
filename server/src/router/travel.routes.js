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
    getBestThreePromoPacks,
    getTopThreeDestinations
} from "../controller/travel.js";

const router = Router();

// !!!!! ATTENTION : l'ordre des routes doit être organisé d'une façon spéciale ':id' et ':name' à la fin. Sinon certaines routes ne marchent pas !
// afficher tous les continents :
router.get("/continent/all", getAllContinents);
// afficher toutes les destinations avec le continent :
router.get("/destination/all-with-continent", getAllContinentsAndDestinations);
// afficher toutes les destinations :
router.get("/destination/all", getAllDestinations);
// afficher la "Top" destination (la plus réservée) :
router.get("/destination/top-offer", getTopThreeDestinations);
// chercher toutes les images de la destination :
router.get("/destination/img/all/:id", getImagesDestination);
// chercher une destination par nom :
router.get("/destination/:name", getDestinationByName);
// chercher toutes les images de l'hébérgement :
router.get("/lodging/img/all/:id", getImagesLodging);
// chercher un hébérgement par ID :
router.get("/lodging/:id", getHebergementById);
// chercher le pack "Best Promo" (celui avec la plus grande réduction) :
router.get("/pack/best-promo", getBestThreePromoPacks);
// chercher un pack par ID de destination :
router.get("/pack/:id", getPacksByDestination);
// chercher une activité par ID de destination :
router.get("/activities/:id", getActivitiesByDestination);


export default router;