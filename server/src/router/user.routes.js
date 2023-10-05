import { Router } from "express";
import { checkToken, createAccount, signIn } from "../controller/user.js";
import { auth } from "../middlewares/auth.js";

const router = Router();

router.get("/check_token", auth, checkToken);

router.post("/signup", createAccount);
router.post("/signin", signIn);

export default router;