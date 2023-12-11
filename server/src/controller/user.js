import Query from "../model/Query.js";
import { hash, compare } from "bcrypt";
// JWT allows to authenticate users in a stateless manner, without actually storing any information about them on the system itself
import jsonwebtoken from "jsonwebtoken";

const { sign } = jsonwebtoken;
const { SK } = process.env;
const SALT = 10;

// vérifier le token
const checkToken = async (req, res) => {
    try {
        const queryUser = "SELECT email, account_type FROM users WHERE email = ? AND account_type = ?";
        await Query.findByDatas(queryUser, req.params);
        res.status(200).json({ msg: "authentifié", email: queryUser.email, accountType: queryUser.accountType});
    } catch(err) {
        throw Error(err);
    }
};
// connecter l'utilisateur :
const userSignIn = async (req, res) => {
    try {
        let msg = "";
        const queryUser = "SELECT id, email, account_type, password FROM users WHERE email = ?";
        //console.log("req.body.email = " + req.body.email);
        const [user] = await Query.findByValue(queryUser, req.body.email);
        //si l'utilisateur est trouvé dans la BDD :
        if (user.length) {
            const same = await compare(req.body.password, user[0].password);

            if (same) {
                msg = "utilisateur trouvé. mdp OK.";
                //console.log(`server: ${msg}`);
                const TOKEN = sign({email: user[0].email, accountType: user[0].account_type}, SK);
                res.status(200).json({ 
                    msg, 
                    TOKEN, 
                    email: user[0].email, 
                    userID: user[0].id, 
                    accountType: user[0].account_type });
            } else {
                msg = "Mot de passe erroné. Contactez l'administrateur.";
                res.status(409).json({ msg });
            }
        } else if (!user.length){
            msg = "Mauvais identifiant";
            res.status(409).json({ msg });
        }
    } catch (err) {
        throw Error(err);
    }
}

// créer un compte utilisateur de type "client" :
const createUserAccount = async (req, res) => {
    try {
        let msg = "";
        const queryUser = "SELECT email FROM users WHERE email = ?";
        const [user] = await Query.findByValue(queryUser, req.body.email);

        if (user.length) {
            msg = "Un utilisateur avec cette adresse mail existe déjà !";
            res.status(409).json({ msg });
        } else if (!user.length){
            //console.log(user);
            //console.log("user.length = "+user.length);
            const datas = {
                lastName: req.body.lastName,
                firstName: req.body.firstName,
                email: req.body.email,
                tel: req.body.tel,
                address: req.body.address,
                birthDate: req.body.birthDate,
                occupation: req.body.occupation,
                password: await hash(req.body.password, SALT)
            };
            const query = "INSERT INTO users (last_name, first_name, email, tel, address, birth_date, occupation, account_type, account_created_by, date_created, password) VALUES (?, ?, ?, ?, ?, ?, ?, 'client', 'client', CURRENT_TIMESTAMP(), ?)";
            await Query.write(query, datas);

            msg = "utilisateur créé";
            res.status(201).json({ msg });
        }
    } catch (err) {
        throw Error(err)
    }
}

// modifier les infos persos de l'utilisateur :
const modifyUserInfo = async (req, res) => {
    try {
        let msg = "";
        const bodyData = [
            req.body.lastName,
            req.body.firstName,
            req.body.tel,
            req.body.address,
            req.body.birthDate,
            req.body.occupation,
            req.body.email
        ]
        //console.log(bodyData);
        const queryUser = "UPDATE users SET last_name = ?, first_name = ?, tel = ?, address = ?, birth_date = ?, occupation = ? WHERE email = ?";
        /*const queryUser = "UPDATE users SET last_name = 'Viv', first_name = 'Vivo', tel = '0123456789', address = '22 rue Montrouge\n33000 Bordeaux', birth_date = '1999-02-12', occupation = 'étudiant' WHERE email = 'victor@victor.com'";*/

        await Query.updateByArray(queryUser, bodyData);
        msg = "utilisateur créé";
        res.status(201).json({ msg });
    } catch (err) {
        throw Error(err)
    }
}

// trouver les données de l'utilisateur par son ID :
const getUserById = async (req, res) => {
    try {
        const query = "SELECT * FROM users WHERE id = ?";
        const [datas] = await Query.findByValue(query, req.params.id);
        res.status(200).json({datas});
    } catch (err) {
        throw Error(err)
    }
}

// trouver toutes les réservations d'un utilisateur :
const getAllUserBookings = async (req, res) => {
    try {
        const query = "SELECT * FROM bookings AS b JOIN packs AS p ON b.pack_id = p.id JOIN destinations AS d ON p.destination_id = d.id WHERE b.user_id = ?";
        const [datas] = await Query.findByValueNTables(query, req.params.id);
        res.status(200).json({ datas });
    } catch (err) {
        throw Error(err)
    }
}

// enregistrer la réservation du pack et des activités :
const createBooking = async (req, res) => {
    try {
        // on enregistre la réservation du pack dans la table 'bookings' :
        const datasPack = {
            nb_adults: req.body.nb_adults,
            nb_children: req.body.nb_children,
            price_total_booking: req.body.price_total_booking,
            paymentType: req.body.paymentType,
            pack_id: req.body.pack_id,
            user_id: req.body.user_id
        };
        console.log(datasPack);
        //console.log("req.body.activities.price_total_act = "+req.body.activities.price_total_act);
        const queryPack = "INSERT INTO bookings (nb_adults, nb_children, price_total_booking, payment_type, status, date_created, pack_id, user_id) VALUES (?, ?, ?, ?, 'en cours', CURRENT_TIMESTAMP(), ?, ?)";
        await Query.write(queryPack, datasPack);
        console.log("req.body.activities.length = "+req.body.activities.length);
        // s'il y a des activités réservées, on les passe dans la table 'booked_activities' :
        if (req.body.activities.length) {
            // on a besoin de récupérer l'ID de la réservation que l'utilisateur pour l'utiliser comme clé étrangère :
            const queryLastBooking = "SELECT id FROM bookings WHERE user_id = ? ORDER BY date_created DESC LIMIT 1";
            const [bookingData] = await Query.findByValue(queryLastBooking, req.body.user_id);
            //console.log(bookingData[0].user_id);
            // on enregistre la réservation des activités dans la table 'booked_activities' :
            const queryActivities = "INSERT INTO booked_activities (nb_adults, nb_children, price_total_act, activity_id, booking_id) VALUES ?";
            await Query.writeAndAddId(queryActivities, req.body.activities, bookingData[0].id);
        }
        //
        let msg = "réservation créée";
        res.status(201).json({ msg });
    } catch (err) {
        throw Error(err)
    }
}

// modifier une réservation et les activités réservées corresp. :
const modifyBooking = async (req, res) => {

}

// supprimer une réservation et les activités réservées corresp. :
const deleteBooking = async (req, res) => {
    try {
        // vérifier s'il y a des activités réservées :
        const queryCheckAct = "SELECT id FROM booked_activities WHERE booking_id = ?";
        const [activities] = await Query.findByValue(queryCheckAct, req.body.id);
        console.log("activities.length = "+activities.length);
        console.log(activities);

        // si des activités trouvées, on les supprime d'abord :
        if (activities.length) {
            const queryDeleteBooking = "DELETE FROM booked_activities WHERE booking_id = ?";
            await Query.delete(queryDeleteBooking, req.body.id);
        }

        // Supprimer la réservation :
        //console.log(req.body.id);
        const queryDeleteBooking = "DELETE FROM bookings WHERE id = ?";
        await Query.delete(queryDeleteBooking, req.body.id);
        let msg = "réservation supprimée";
        res.status(201).json({ msg });
    } catch (err) {
        throw Error(err)
    }
}

export { checkToken, 
        createUserAccount, 
        userSignIn,
        modifyUserInfo,
        getUserById,
        getAllUserBookings,
        createBooking,
        modifyBooking,
        deleteBooking
};