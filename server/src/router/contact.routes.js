import { Router } from "express";
import { validationRules, validateResult } from "../middlewares/validate.js";
import { 
    sendMail,
    subscribeNewsletter
} from "../controller/contact.js";

const router = Router();

// envoyer un message du Contact form :
router.post("/sendmail", 
            validationRules('sendMail'), 
            validateResult, 
            sendMail);
// envoyer un message du Newsletter form :
router.post("/newsletter", 
            validationRules('subscribeNewsletter'), 
            validateResult, 
            subscribeNewsletter);

export default router;