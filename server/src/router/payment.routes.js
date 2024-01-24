import { Router } from "express";
import { validationRules, validateResult } from "../middlewares/validate.js";
import { 
    getPublishableKey,
    createPaymentIntent
} from "../controller/payment.js";

const router = Router();

// le clé publiable
router.get("/config", getPublishableKey);
// le secret du client
router.post("/create-payment-intent", 
            validationRules('payment'), 
            validateResult,
            createPaymentIntent);

export default router;