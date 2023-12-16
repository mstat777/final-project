import { Router } from "express";
import { 
    getAllContinentsAndDestinations,
    getAllContinents,
    getAllDestinations,
    getAllDataIfPacks,
    getAllDataAllPacks,
    getDestinationAllData,
    getPackAllData,
    getDestinationByName,
    getImagesDestination,
    getImagesLodging,
    getLodgingById,
    getPacksByDestination,
    getActivitiesByDestination,
    getBestThreePromoPacks,
    getTopThreeDestinations
} from "../controller/travel.js";

const router = Router();


// !!!!! ATTENTION : l'ordre des routes doit être organisé d'une façon spéciale ':id' et ':name' à la fin. Sinon certaines routes ne marchent pas !


// ---------------------- GET ---------------------------
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

// chercher toutes les données liées aux packs de la destination chosie : destination, hébérgement et url photos :
router.get("/destination-all-packs/:name", getAllDataAllPacks);

// chercher toutes les données liées aux packs de la destination chosie : destination, hébérgement et url photos :
router.get("/destination-all-data/:name", getDestinationAllData);

// chercher une destination par nom :
router.get("/destination/:name", getDestinationByName);

// chercher toutes les images de l'hébérgement :
router.get("/lodging/img/all/:id", getImagesLodging);
// chercher un hébérgement par ID :
router.get("/lodging/:id", getLodgingById);

// chercher le pack "Best Promo" (celui avec la plus grande réduction) :
router.get("/pack/best-promo", getBestThreePromoPacks);
// chercher un pack par ID de destination :
router.get("/pack/:id", getPacksByDestination);
// chercher toutes les données liées à un pack (pour qu'il soit modifié) :
router.get("/pack-all-data/:id", getPackAllData);

// chercher une activité par ID de destination :
router.get("/activities/:id", getActivitiesByDestination);


// ---------------------- POST ---------------------------
// chercher toutes les données (destination, hébérgement, url photos) des packs de la destination chosie qui correspondent aux critères des filtres :
router.post("/destinations-and-packs", getAllDataIfPacks);



export default router;