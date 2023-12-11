import { Router } from "express";

import {
        getAllLodgingsID,
        getAllDestinationsID,
        getBookingByMultiInputs,
        getDestinationByMultiInputs,
        getLodgingByMultiInputs,

        modifyLodging,

        createLodging,
        createDestination,
        createPack,
        createActivity,

        deleteLodging
        } from "../controller/admin.js";

const router = Router();

/*******************************************************/
/********* Dashboard Admin - protected links : *********/
/*******************************************************/

// récupérer les données pour les listes déroulants dans les formulaires :
router.get("/lodgings/id/all", getAllLodgingsID);
router.get("/destinations/id/all", getAllDestinationsID);

// trouver une réservation via le form de recherche (nom/prénom/mail utilisateur, réf. pack, date réservation) :
router.post("/bookings", getBookingByMultiInputs);
// trouver une réservation via le form de recherche :
router.post("/destinations", getDestinationByMultiInputs);
// trouver un hébérgement via le form de recherche :
router.post("/lodgings", getLodgingByMultiInputs);

// modifier dans la BDD :
router.post("/lodgings/modify", modifyLodging);

// créer (insérer dans la BDD) :
router.post("/lodgings/create", createLodging);
router.post("/destinations/create", createDestination);
router.post("/packs/create", createPack);
router.post("/activities/create", createActivity);

// supprimer de la BDD:
router.post("/lodgings/delete", deleteLodging);

export default router;