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
    const query = "SELECT email, password FROM users WHERE email = ?";
    const [user] = await Query.findByValue(query, req.body.email);
    if (user.length) {
        //console.log("user.mail = "+user[0].mail);
        //console.log("user.mdp = "+user[0].mdp);
        const same = await bcrypt.compare(req.body.password, user[0].password);
        if (same) {
            // Payload to generate JWT
            const payload = {
                email: user.email,
                password: user.password,
            };
            // Create a jsonwebtoken that expires in 1h
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
        const queryUser = "SELECT email FROM users WHERE email = ?";
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
                birthDate: req.body.birthDate,
                occupation: req.body.occupation,
                password: await hash(req.body.password, SALT)
            };
            //const query = "INSERT INTO utilisateurs (nom, prenom, mail, tel) VALUES (?, ?, ?, ?)";
            const query = "INSERT INTO utilisateurs (last_name, first_name, email, tel, addresse, birth_date, occupation, account_type, account_created_by, date_created, password) VALUES (?, ?, ?, ?, ?, ?, ?, 'admin', 'admin', CURRENT_TIMESTAMP(), ?)";
            await Query.write(query, datas);

            msg = "utilisateur créé";
            res.status(201).json({ msg });
        }
    } catch (err) {
        throw Error(err)
    }
}

const getReservationById = async (req, res) => {
    const query = "SELECT * FROM bookings WHERE id = ?";
    const [datas] = await Query.findByValue(query, req.body.booking_id);
    res.status(200).render("admin/layout",
    { datas });
} 

export { getAdminHome,
        getSignOut,
        getSignIn,
        adminSignIn,
        getSignUp,
        createAdminAccount,
        getReservationById,
};