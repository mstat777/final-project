import { Router } from 'express';
import userRoutes from './user.routes.js';
import adminRoutes from './admin.routes.js';
import bookingRoutes from './booking.routes.js';
import travelRoutes from './travel.routes.js';
import contactRoutes from './contact.routes.js';
import paymentRoutes from './payment.routes.js';

const router = Router();

router.use("/api/v.0.1/user", userRoutes);
router.use("/api/v.0.1/admin", adminRoutes);
router.use("/api/v.0.1/booking", bookingRoutes);
router.use("/api/v.0.1/travel", travelRoutes);
router.use("/api/v.0.1/contact", contactRoutes);
router.use("/api/v.0.1/payment", paymentRoutes);

router.get("*", (req, res) => {
    res.status(404).json({ msg: "not found"});
})

export default router;