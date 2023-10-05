import { Router } from "express";
import { getLastOffer } from "../controller/travel.js";

const router = Router();

router.get("/last", getLastOffer);

export default router;