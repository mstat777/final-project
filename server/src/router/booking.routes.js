import { Router } from "express";
import { createBooking,
        modifyBooking,
        deleteBooking,
        getBookingByMultiInputs,
        getAllUserBookings,
        getBookingAllData} from "../controller/booking.js";
import { auth } from "../middlewares/auth.js";
import { validationRules, validateResult } from "../middlewares/validate.js";

const router = Router();

// créer une réservation (confirmer sur la page Sommaire("Summary"))
router.post("/create", 
            auth, 
            validationRules('createBooking'), 
            validateResult, 
            createBooking);

// l'utilisateur modifie une de ses réservations :
router.post("/modify", 
            auth, 
            validationRules('modifyBooking'), 
            validateResult, 
            modifyBooking);

// l'utilisateur supprime une de ses réservations :
router.post("/delete", auth, deleteBooking);

// trouver une réservation via le form de recherche (nom/prénom/mail utilisateur, réf. pack, date réservation) :
router.post("/find", auth, getBookingByMultiInputs);

// trouver toutes les réservations par l'ID de l'utilisateur :
router.get("/user/:id", auth, getAllUserBookings);

// toutes les données de la réservation (pack + activités) nécessaires pour la modifier :
router.post('/all-data', auth, getBookingAllData);

export default router;