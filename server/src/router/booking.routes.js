import { Router } from "express";
import { getAllUserBookings,
        getBookingAllData,
        createBooking,
        modifyBooking,
        deleteBooking
        } from "../controller/booking.js";

const router = Router();

// trouver toutes les réservations par l'ID de l'utilisateur :
router.get("/mybookings/:id", getAllUserBookings);

// toutes les données de la réservation (pack + activités) nécessaires pour la modifier :
router.post('/all-data', getBookingAllData);

// créer une réservation (confirmer sur la page Sommaire("Summary"))
router.post("/create", createBooking);

// l'utilisateur supprime une de ses réservations :
router.post("/modify", modifyBooking);

// l'utilisateur supprime une de ses réservations :
router.post("/delete", deleteBooking);

export default router;