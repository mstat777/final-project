import { Router } from "express";
import { checkToken, 
        createUserAccount, 
        userSignIn,
        } from "../controller/user.js";
import { auth } from "../middlewares/auth.js";

const router = Router();

// vérifier le token
router.get("/check-token", auth, checkToken);

// créer un compte utilisateur client :
router.post("/signup", createUserAccount);

// page de connexion pour l'utilisateur client :
router.post("/signin", userSignIn);

export default router;