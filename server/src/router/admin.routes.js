import { Router } from "express";

import {    getHome,
            getReservationById,
            addReservation,
            getUserById,
            getSignIn,
            adminSignedIn,
            getSignUp
        } from "../controller/admin.js";
import { createAccount } from "../controller/user.js";


const router = Router();

router.get("/", getHome);

router.get("/reservation", getReservationById);
router.post("/reservation/add", addReservation);

router.get("/user", getUserById);

router.get("/signin", getSignIn);
router.post("/signin", adminSignedIn);

router.get("/signin", getSignUp);
router.post("/signup", createAccount);

export default router;