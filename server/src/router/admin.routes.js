import { Router } from "express";

import {getBookingByMultipleInputs,
        createLodging,
        getAllLodgingsID,
        createDestination
        } from "../controller/admin.js";

const router = Router();

// ************************************* //
// *** Dashboard - protected links : *** //
// ************************************* //

// trouver une réservation par le nom d'utilisateur (à SUPPRIMER) :
//router.get("/bookings/last-name/:name", getBookingByLastName);
// trouver une réservation par le nom/prénom/mail d'utilisateur, réf. du pack ou la date de réservation :
router.get("/bookings", getBookingByMultipleInputs);

router.get("/lodgings/id/all", getAllLodgingsID);

router.post("/lodgings/create", createLodging);
router.post("/destinations/create", createDestination);

export default router;