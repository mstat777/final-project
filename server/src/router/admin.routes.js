import { Router } from "express";

import {getBookingByMultipleInputs,

        getAllLodgingsID,
        getAllDestinationsID,

        createLodging,
        createDestination,
        createPack,
        createActivity
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
router.get("/destinations/id/all", getAllDestinationsID);

router.post("/lodgings/create", createLodging);
router.post("/destinations/create", createDestination);
router.post("/packs/create", createPack);
router.post("/activities/create", createActivity);

export default router;