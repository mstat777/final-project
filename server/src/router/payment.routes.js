import { Router } from "express";
import { 
    getPublishableKey,
    createPaymentIntent
} from "../controller/payment.js";

const router = Router();

// le clé publiable
router.get("/config", getPublishableKey);
// le secret du client
router.post("/create-payment-intent", createPaymentIntent);

export default router;