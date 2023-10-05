import Query from "../model/Query.js";
import { hash } from "bcrypt";
// JWT allows to authenticate users in a stateless manner, without actually storing any information about them on the system itself
import jsonwebtoken from "jsonwebtoken";

const { sign } = jsonwebtoken;
const { SK } = process.env;
const SALT = 10;

const getHome = (req, res) => {
    res.status(200).render("admin/layout", {template: "home"});
}

const getSignUp = async (req, res) => {
    res.status(200).render("admin/layout", {
        template: "signup"
    });
}

const getSignIn = async (req, res) => {
    res.status(200).render("admin/layout", {
        template: "signin", msg: ""
    });
}

const adminSignedIn = async (req, res) => {
    if (!req.body.email || !req.body.password) {
        res.redirect("/user/signin?msg=Pas%20de%20champs%20vide%20!");
        return;
    }
    const query = "SELECT mail, mdp FROM utilisateurs WHERE mail = ?";
    const [user] = await Query.findByValue(query, req.body.email);
    console.log(`${req.body.email} is trying to login ..`);
    if (user.length) {

        const same = await bcrypt.compare(req.body.password, user.password);
        if (same) {
            return res.json({
                token: jsonwebtoken.sign({ id: user.id }, SK),
            });
            //res.redirect("/");
        } else {
            res.redirect(
                "/signin?msg=Mot%20de%20passe%20erroné%20!%20Contactez%20l'administrateur%20!"
            );
        }
    } else res.redirect("/signin?msg=Email%20inconnu%20!");
}

const getReservationById = async (req, res) => {
    const query = "SELECT * FROM reservations WHERE id = ?";
    const [datas] = await Query.findByValue(query, req.body.reservation_id);
    res.status(200).render("admin/layout",
    { datas });
} 

const addReservation = async (req, res) => {
    const datas = {
        prix: req.body.prix,
        adultes: req.body.adultes,
        enfants: req.body.enfants,
        paiement: req.body.paiement,
        date_offre_id: req.body.date_offre_id,
        utilisateur_id: req.body.utilisateur_id
    }
    const query = "INSERT INTO reservations (date, prix, adultes, enfants, paiement, statut, date_offre_id, utilisateur_id) VALUES (NOW(), ?, ?, ?, ?, 'validé', ?, ?)";
    await Query.write(query, datas);

    let msg = "utilisateur créé";
    res.status(201).json({ msg });
}

const getUserById = async (req, res) => {
    const query = "SELECT * FROM users WHERE id = ?";
    const [datas] = await Query.findByValue(query, req.body.utilisateur_id);
    res.status(200).json({ datas });
} 

export { getHome,
        getReservationById,
        addReservation,
        getUserById,
        getSignIn,
        adminSignedIn,
        getSignUp
};