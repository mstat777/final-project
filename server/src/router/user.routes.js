import { Router } from "express";
import { checkToken, 
        createUserAccount, 
        userSignIn,
        getUserById,
        getAllUserBookings,
        makeBooking
        } from "../controller/user.js";
import { auth } from "../middlewares/auth.js";

const router = Router();

// vérifier le token
router.get("/check-token", auth, checkToken);

// créer un compte utilisateur client :
router.post("/signup", createUserAccount);

// loguer l'utilisateur :
router.post("/signin", userSignIn);

// trouver un utilisateur par son ID :
router.get("/:id", getUserById);

// trouver toutes les réservations par l'ID de l'utilisateur :
router.get("/mybookings/:id", getAllUserBookings);

// créer une réservation (confirmer sur la page Sommaire("Summary"))
router.post("/booking", makeBooking);

export default router;