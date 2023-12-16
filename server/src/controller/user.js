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
        const queryUser = "SELECT email, account_type, id FROM users WHERE email = ? AND account_type = ?";
        const [user] = await Query.findByDatas(queryUser, req.params);
        res.status(200).json({ 
            msg: "authentifié", 
            email: user[0].email, 
            userID: user[0].id,
            accountType: user[0].account_type});
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
                console.log("utilisateur trouvé. mdp OK.");
                //console.log(`server: ${msg}`);
                const TOKEN = sign({email: user[0].email, accountType: user[0].account_type}, SK);
                res.status(200).json({ 
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
        const queryCheckUser = "SELECT email FROM users WHERE email = ?";
        const [user] = await Query.findByValue(queryCheckUser, req.body.email);

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
            const queryWriteUser = "INSERT INTO users (last_name, first_name, email, tel, address, birth_date, occupation, account_type, account_created_by, date_created, password) VALUES (?, ?, ?, ?, ?, ?, ?, 'client', 'client', CURRENT_TIMESTAMP(), ?)";
            await Query.write(queryWriteUser, datas);

            // souscrire dans le Newsletter :
            if (req.body.checkBoxNewsL) {
                console.log("req.body.email = "+req.body.email);
                const queryNewsL = "INSERT INTO newsletter (email) VALUES (?)";
                await Query.writeWithValue(queryNewsL, req.body.email);
            }

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
        // récupérer les données du pack réservé :
        const query = "SELECT b.*, p.*, d.id, d.name, d.country FROM bookings AS b JOIN packs AS p ON b.pack_id = p.id JOIN destinations AS d ON p.destination_id = d.id WHERE b.user_id = ?";
        const [datas] = await Query.findByValueNTables(query, req.params.id);
        res.status(200).json({ datas });
    } catch (err) {
        throw Error(err)
    }
}

// trouver toutes les données de la réservation (pack + activités) nécessaires pour la modifier :
const getBookingAllData = async (req, res) => {
    try {
        // récupérer les données de la réservation :
        const queryBook = "SELECT * FROM bookings WHERE id = ?";
        const [datasBook] = await Query.findByValue(queryBook, req.body.bookingID);

        // récupérer les données du pack :
        const queryPack = "SELECT * FROM packs WHERE id = ?";
        const [datasPack] = await Query.findByValue(queryPack, datasBook[0].pack_id);

        // récupérer les données de la destination :
        const queryDest = "SELECT id, name, country FROM destinations WHERE id = ?";
        const [datasDest] = await Query.findByValue(queryDest, datasPack[0].destination_id);

        // récupérer les données des activités :
        const queryBookAct = "SELECT * FROM booked_activities WHERE booking_id = ?";
        const [datasBookAct] = await Query.findByValue(queryBookAct, req.body.bookingID);

        // le nb d'activités :
        const queryNbAct = "SELECT COUNT(*) AS total FROM destinations_activities WHERE destination_id = ?";
        const [datasNbAct] = await Query.findByValue(queryNbAct, datasPack[0].destination_id);

        res.status(200).json({ datasBook,
                            datasPack,
                            datasDest,
                            datasBookAct,
                            datasNbAct });
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
    try {
        // -------------- modifier PACK ---------------
        // on enregistre la réservation du pack dans la table 'bookings' :
        //console.log(req.body);
        const datasPack = {
            nb_adults: req.body.nb_adults,
            nb_children: req.body.nb_children,
            price_total_booking: req.body.price_total_booking,
            payment_type: req.body.paymentType,
            id: req.body.bookingID
        };
        console.log(datasPack);
        const queryPack = "UPDATE bookings SET nb_adults = ?, nb_children = ?, price_total_booking = ?, payment_type = ? WHERE id = ?";
        //const queryPack = "UPDATE bookings SET nb_adults = '2', nb_children = '3', price_total_booking = '11567.00', payment_type = '2' WHERE id = '35'";
        await Query.update(queryPack, datasPack);

        // -------------- modifier ACTIVITÉS ---------------
        // s'il y a des activités réservées, on les passe dans la table 'booked_activities' :
        // on compare le nouvel état avec l'ancien pour savoir quelles activités sont à mettre à jour, insérer, supprimer :
        for(let i = 0; i < req.body.newBookedActiv.length; i++){
            if (req.body.newBookedActiv[i].activity_id && 
                req.body.oldBookedActiv[i].activity_id ) {
                // il s'agit d'une MAJ :
                console.log("MAJ");
                //console.log("old ID = "+req.body.oldBookedActiv[i].activity_id);
                //console.log("new ID = "+req.body.newBookedActiv[i].activity_id);
                const datasActUpd = {
                    nb_adults: req.body.newBookedActiv[i].nb_adults,
                    nb_children: req.body.newBookedActiv[i].nb_children,
                    price_total_act: req.body.newBookedActiv[i].price_total_act,
                    activity_id: req.body.newBookedActiv[i].activity_id,
                    booking_id: req.body.newBookedActiv[i].booking_id,
                    id: req.body.oldBookedActiv[i].id
                };
                console.log(datasActUpd);
                const queryBookActUpd = "UPDATE booked_activities SET nb_adults = ?, nb_children = ?, price_total_act = ?, activity_id = ?, booking_id = ? WHERE id = ?";
                await Query.update(queryBookActUpd, datasActUpd);
            }
            else if (req.body.newBookedActiv[i].activity_id && 
                    !req.body.oldBookedActiv[i].activity_id) {
                // c'est une nouvelle act. à enregistrer  :
                console.log("NEW");
                console.log("old ID = "+req.body.oldBookedActiv[i].activity_id);
                console.log("new ID = "+req.body.newBookedActiv[i].activity_id);

                delete req.body.newBookedActiv[i].name;
                console.log(req.body.newBookedActiv[i]);
                /*const datasActIns = {
                    nb_adults: req.body.newBookedActiv[i].nb_adults,
                    nb_children: req.body.newBookedActiv[i].nb_children,
                    price_total_act: req.body.newBookedActiv[i].price_total_act,
                    activity_id: req.body.newBookedActiv[i].activity_id,
                    booking_id: req.body.newBookedActiv[i].booking_id
                };*/
                const queryBookActIns = "INSERT INTO booked_activities (nb_adults, nb_children, price_total_act, activity_id, booking_id) VALUES (?, ?, ?, ?, ?)";
                //await Query.write(queryBookActIns, datasActIns);
                await Query.write(queryBookActIns, req.body.newBookedActiv[i]);
            }
            else if (!req.body.newBookedActiv[i].activity_id && 
                    req.body.oldBookedActiv[i].activity_id) {
                // c'est l'ancienne act. à supprimer :
                console.log("DEL");
                //console.log("old ID = "+req.body.oldBookedActiv[i].activity_id);
                //console.log("new ID = "+req.body.newBookedActiv[i].activity_id);
                const queryBookActDel = "DELETE FROM booked_activities WHERE id = ?";
                await Query.delete(queryBookActDel, req.body.oldBookedActiv[i].id);
            }
        }
        //
        let msg = "réservation modifiée";
        res.status(201).json({ msg });
    } catch (err) {
        throw Error(err)
    }
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
        getBookingAllData,
        createBooking,
        modifyBooking,
        deleteBooking
};