import Query from "../model/Query.js";
import bcrypt from "bcrypt";
// JWT allows to authenticate users in a stateless manner, without actually storing any information about them on the system itself
import jsonwebtoken from "jsonwebtoken";
import jwt from "jsonwebtoken";

const { sign } = jsonwebtoken;
const { SK } = process.env;
const SALT = 10;

const getSignIn = async (req, res) => {
    res.status(200).render("admin/layout", {
        template: "signin", msg: "Veuillez vous connecter :"
    });
}

const adminSignIn = async (req, res) => {
    if (!req.body.email || !req.body.password) {
        res.redirect("/signin?msg=Pas%20de%20champs%20vide%20!");
        return;
    }
    const query = "SELECT mail, mdp FROM utilisateurs WHERE mail = ?";
    const [user] = await Query.findByValue(query, req.body.email);
    if (user.length) {
        //console.log("user.mail = "+user[0].mail);
        //console.log("user.mdp = "+user[0].mdp);
        const same = await bcrypt.compare(req.body.password, user[0].mdp);
        if (same) {
            // Payload to generate JWT
            const payload = {
                email: user.email,
                password: user.password,
            };
            // Create a jsonwebtoken that expires in 5 days
            const token = jwt.sign(payload, SK, { expiresIn: '1h' });

            /*res.status(200).json({
                msg: "admin connecté",
                token: token
            });*/
            res.redirect("/api/v.0.1/admin/dashboard");

        } else {
            res.redirect(
                "/signin?msg=Mot%20de%20passe%20erroné%20!%20Contactez%20l'administrateur%20!"
            );
        }
    } else res.redirect("/signin?msg=Email%20inconnu%20!");
}

const getSignOut = (req, res) => {
    req.session.destroy();
    res.redirect("/");
}

const getAdminHome = (req, res) => {
    console.log("page getAdminHome");
    res.status(200).render("admin/layout", {
        template: "home",
        email: req.params.email
    });
}

const getSignUp = async (req, res) => {
    res.status(200).render("admin/layout", {
        template: "signup", msg: ""
    });
}

const createAdminAccount = async (req, res) => {
    try {
        let msg = "";
        const datas = {
            email: req.body.email
        };
        const queryUser = "SELECT mail FROM utilisateurs WHERE mail = ?";
        const [user] = await Query.findByValue(queryUser, datas);

        if (user.length) {
            msg = "un utilisateur avec cette adresse mail existe déjà";
            req.status(409).json({ msg });
        } else if (!user.length){
            const datas = {
                lastName: req.body.lastName,
                firstName: req.body.firstName,
                email: req.body.email,
                tel: req.body.tel,
                addresse: req.body.addresse,
                birthday: req.body.birthday,
                profession: req.body.profession,
                password: await hash(req.body.password, SALT)
            };
            //const query = "INSERT INTO utilisateurs (nom, prenom, mail, tel) VALUES (?, ?, ?, ?)";
            const query = "INSERT INTO utilisateurs (nom, prenom, mail, tel, adresse, date_naissance, profession, type_compte, compte_cree_par, date_creation, mdp) VALUES (?, ?, ?, ?, ?, ?, ?, 'admin', 'admin', CURRENT_TIMESTAMP(), ?)";
            await Query.write(query, datas);

            msg = "utilisateur créé";
            res.status(201).json({ msg });
        }
    } catch (err) {
        throw Error(err)
    }
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

export { getSignOut,
        getSignIn,
        adminSignIn,
        getAdminHome,
        getSignUp,
        createAdminAccount,
        getUserById,
        getReservationById,
        addReservation
};