import { Router } from "express";

import {    getSignOut,
            getAdminHome,
            getSignUp, 
            createAdminAccount,
            getReservationById,
            addReservation,
            getUserById
        } from "../controller/admin.js";

const router = Router();

// ************************************* //
// *** Dashboard - protected links : *** //
// ************************************* //

// page d'accueil admin connecté
router.get("/", getAdminHome);

// se déconnecter :
router.get("/signout", getSignOut);

// créer un compte utilisateur via le formulaire de création :
router.get("/signup", getSignUp);
router.post("/signup", createAdminAccount);

// trouver un utilisateur par son ID :
router.get("/user", getUserById);

// trouver une réservation par son ID :
router.get("/reservation", getReservationById);

// créer une réservation ???????????????? :
router.post("/reservation/add", addReservation);

export default router;