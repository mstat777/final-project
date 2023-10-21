import { Router } from "express";
import { 
    getAllDestinations,
    getLastOffer 
} from "../controller/travel.js";

const router = Router();

router.get("/all-destinations", getAllDestinations);
router.get("/last", getLastOffer);

export default router;