import { Router } from "express";

import {getAllLodgingsID,
        getAllDestinationsID,
        getLodgingByMultiInputs,
        getDestinationByMultiInputs,
        getPackByMultiInputs,
        getActivityByMultiInputs,
        getUserByMultiInputs,

        modifyLodging,
        modifyDestination,
        modifyPack,
        modifyActivity,

        createLodging,
        createDestination,
        createPack,
        createActivity,
        
        deleteLodging,
        deleteDestination,
        deletePack,
        deleteActivity } from "../controller/admin.js";
import { auth } from '../middlewares/auth.js';

const router = Router();

/*******************************************************/
/********* Dashboard Admin - protected links : *********/
/*******************************************************/

// récupérer les données pour les listes déroulants dans les formulaires :
router.get("/lodgings/id/all", getAllLodgingsID);
router.get("/destinations/id/all", getAllDestinationsID);

// trouver un hébérgement via le form de recherche :
router.post("/lodgings", getLodgingByMultiInputs);
// trouver une destination via le form de recherche :
router.post("/destinations", getDestinationByMultiInputs);
// trouver un hébérgement via le form de recherche :
router.post("/packs", getPackByMultiInputs);
// trouver un utilisateur via le form de recherche :
router.post("/activities", getActivityByMultiInputs);
// trouver un utilisateur via le form de recherche :
router.post("/users", getUserByMultiInputs);

// ------------------ chemins protegés ---------------------
// MODIFIER dans la BDD :
router.post("/lodgings/modify", auth, modifyLodging);
router.post("/destinations/modify", auth, modifyDestination);
router.post("/packs/modify", auth, modifyPack);
router.post("/activities/modify", auth, modifyActivity);
// CRÉER (insérer dans la BDD) :
router.post("/lodgings/create", auth, createLodging);
router.post("/destinations/create", auth, createDestination);
router.post("/packs/create", auth, createPack);
router.post("/activities/create", auth, createActivity);
// SUPPRIMER de la BDD:
router.post("/lodgings/delete", auth, deleteLodging);
router.post("/destinations/delete", auth, deleteDestination);
router.post("/packs/delete", auth, deletePack);
router.post("/activities/delete", auth, deleteActivity);

export default router;