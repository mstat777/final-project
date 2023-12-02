import { Router } from "express";
import { 
    sendMail,
    subscribeNewsletter
} from "../controller/contact.js";

const router = Router();

// envoyer un message du Contact form :
router.post("/message", sendMail);
// envoyer un message du Newsletter form :
router.post("/newsletter", subscribeNewsletter);

export default router;