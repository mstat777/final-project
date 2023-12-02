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

/*******************************************************/
/********* Dashboard Admin - protected links : *********/
/*******************************************************/

/* trouver une réservation par le nom d'utilisateur (à SUPPRIMER) :
router.get("/bookings/last-name/:name", getBookingByLastName);*/

// trouver une réservation via le form de recherche (nom/prénom/mail utilisateur, réf. pack, date réservation) :
router.post("/bookings", getBookingByMultipleInputs);

// récupérer les données pour les listes déroulants dans les formulaires :
router.get("/lodgings/id/all", getAllLodgingsID);
router.get("/destinations/id/all", getAllDestinationsID);

// insérer dans la BDD :
router.post("/lodgings/create", createLodging);
router.post("/destinations/create", createDestination);
router.post("/packs/create", createPack);
router.post("/activities/create", createActivity);

export default router;