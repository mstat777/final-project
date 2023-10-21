import { Router } from "express";
import admin_routes from "./admin.routes.js";
import travel_routes from "./travel.routes.js";
import user_routes from "./user.routes.js";
import { auth } from "../middlewares/auth.js";
import { getSignIn, adminSignIn } from "../controller/admin.js";

const router = Router();

router.use("/api/v.0.1/user", user_routes);
router.use("/api/v.0.1/travel", travel_routes);
router.use("/api/v.0.1/admin/dashboard", admin_routes);

// page de connexion pour les admins pour accéder au Backoffice :
router.get("/api/v.0.1/admin", getSignIn);
router.post("/api/v.0.1/admin", adminSignIn);

//
router.get("*", (req, res) => {
    res.status(404).json({ msg: "not found"});
})

export default router;