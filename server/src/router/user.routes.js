import { Router } from "express";
import { checkToken, 
        createUserAccount, 
        userSignIn,
        modifyUserInfo,
        getUserById,
        getAllUserBookings,
        getBookingAllData,
        createBooking,
        modifyBooking,
        deleteBooking
        } from "../controller/user.js";
import { auth } from "../middlewares/auth.js";

const router = Router();

// vérifier le token
router.get("/check-token", auth, checkToken);

// créer un compte utilisateur client :
router.post("/signup", createUserAccount);

// loguer l'utilisateur :
router.post("/signin", userSignIn);

// modifier les infos persos de l'utilisateur :
router.post("/modify-user-info", modifyUserInfo);

// trouver un utilisateur par son ID :
router.get("/:id", getUserById);

/* ------------------ RESERVATIONS --------------------- */
// trouver toutes les réservations par l'ID de l'utilisateur :
router.get("/mybookings/:id", getAllUserBookings);


// toutes les données de la réservation (pack + activités) nécessaires pour la modifier :
router.post('/booking-all-data', getBookingAllData);

// créer une réservation (confirmer sur la page Sommaire("Summary"))
router.post("/booking/create", createBooking);

// l'utilisateur supprime une de ses réservations :
router.post("/booking/modify", modifyBooking);

// l'utilisateur supprime une de ses réservations :
router.post("/booking/delete", deleteBooking);



export default router;