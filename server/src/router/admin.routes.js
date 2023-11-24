import { Router } from "express";

import {    getBookingByLastName,
        } from "../controller/admin.js";

const router = Router();

// ************************************* //
// *** Dashboard - protected links : *** //
// ************************************* //

// trouver une réservation par le nom d'utilisateur :
router.get("/booking/last-name/:name", getBookingByLastName);

export default router;