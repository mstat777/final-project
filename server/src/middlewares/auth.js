import jwt from "jsonwebtoken";

const { SK } = process.env;

export const auth = (req, res, next) => {
    // si un token est envoyé par le client (HOC)
    if (req.headers.authentication) {
        const TOKEN = req.headers.authentication.slice(7);
    
        if (TOKEN === undefined || TOKEN === "null") {
            res.status(401).json({ msg: "Accès non autorisé"});
            return;
        } else {
            jwt.verify(TOKEN, SK, (err, decoded) => {
                if (err){
                    res.status(401).json({status: 401, msg: "token invalide"});
                    return;
                } else {
                    req.params.email = decoded.email;
                    req.params.accountType = decoded.accountType;
                    next();
                }
            })
        }
    } else {
        res.status(401).json({ msg: "Accès non autorisé"});
        return;
    }
}