import { Router } from "express";
import admin_routes from "./admin.routes.js";
import travel_routes from "./travel.routes.js";
import user_routes from "./user.routes.js";
import contact_routes from "./contact.routes.js";

const router = Router();

router.use("/api/v.0.1/user", user_routes);
router.use("/api/v.0.1/travel", travel_routes);
router.use("/api/v.0.1/admin", admin_routes);
router.use("/api/v.0.1/contact", contact_routes);

//
router.get("*", (req, res) => {
    res.status(404).json({ msg: "not found"});
})

export default router;