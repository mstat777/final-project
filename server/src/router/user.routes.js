import { Router } from "express";
import { checkToken, 
        createUserAccount, 
        userSignIn,
        modifyUserInfo,
        getUserById
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
router.post("/modify-user-info", auth, modifyUserInfo);

// trouver un utilisateur par son ID :
router.get("/:id", auth, getUserById);

export default router;