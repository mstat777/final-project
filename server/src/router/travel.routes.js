import { Router } from "express";
import { 
    getAllDestinations,
    getDestinationByName
} from "../controller/travel.js";

const router = Router();

// afficher les noms de toutes les destinations :
router.get("/destination/all", getAllDestinations);
// chercher une destination par nom :
router.get("/destination/:name", getDestinationByName);

export default router;