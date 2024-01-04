import Query from "../model/Query.js";


// trouver toutes les réservations d'un utilisateur :
const getAllUserBookings = async (req, res) => {
    try {
        // récupérer les données du pack réservé :
        const query = "SELECT b.*, p.*, d.id, d.name, d.country FROM bookings AS b JOIN packs AS p ON b.pack_id = p.id JOIN destinations AS d ON p.destination_id = d.id WHERE b.user_id = ?";
        const [datas] = await Query.queryByValueNTables(query, req.params.id);
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
        const [datasBook] = await Query.queryByValue(queryBook, req.body.bookingID);

        // récupérer les données du pack :
        const queryPack = "SELECT * FROM packs WHERE id = ?";
        const [datasPack] = await Query.queryByValue(queryPack, datasBook[0].pack_id);

        // récupérer les données de la destination :
        const queryDest = "SELECT id, name, country FROM destinations WHERE id = ?";
        const [datasDest] = await Query.queryByValue(queryDest, datasPack[0].destination_id);

        // récupérer les données des activités :
        const queryBookAct = "SELECT * FROM booked_activities WHERE booking_id = ?";
        const [datasBookAct] = await Query.queryByValue(queryBookAct, req.body.bookingID);

        // le nb d'activités :
        const queryNbAct = "SELECT COUNT(*) AS total FROM destinations_activities WHERE destination_id = ?";
        const [datasNbAct] = await Query.queryByValue(queryNbAct, datasPack[0].destination_id);

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
        const queryPack = "INSERT INTO bookings (nb_adults, nb_children, price_total_booking, payment_type, status, date_created, pack_id, user_id) VALUES (?, ?, ?, ?, 'en cours', CURRENT_TIMESTAMP(), ?, ?)";
        await Query.queryByObject(queryPack, datasPack);
        // s'il y a des activités réservées, on les passe dans la table 'booked_activities' :
        if (req.body.activities.length) {
            // on récupère l'ID de la réservation :
            const queryLastBooking = "SELECT id FROM bookings WHERE user_id = ? ORDER BY date_created DESC LIMIT 1";
            const [bookingData] = await Query.queryByValue(queryLastBooking, req.body.user_id);
            // et on l'insère dans chaque activité :
            const newData = [];
            req.body.activities.map(el => {
                el = [...el, bookingData[0].id];
                newData.push(el);
                //console.log(el);
            });
            console.log(newData);
            // on enregistre les activités réservées :
            const queryActivities = "INSERT INTO booked_activities (nb_adults, nb_children, price_total_act, activity_id, booking_id) VALUES ?";
            await Query.queryByArray(queryActivities, [newData]);
        }
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
        const datasPack = {
            nb_adults: req.body.nb_adults,
            nb_children: req.body.nb_children,
            price_total_booking: req.body.price_total_booking,
            payment_type: req.body.paymentType,
            id: req.body.bookingID
        };
        const queryPack = "UPDATE bookings SET nb_adults = ?, nb_children = ?, price_total_booking = ?, payment_type = ? WHERE id = ?";
        //const queryPack = "UPDATE bookings SET nb_adults = '2', nb_children = '3', price_total_booking = '11567.00', payment_type = '2' WHERE id = '35'";
        await Query.queryByObject(queryPack, datasPack);

        // -------------- modifier ACTIVITÉS ---------------
        // s'il y a des activités réservées, on les passe dans la table 'booked_activities' :
        // on compare le nouvel état avec l'ancien pour savoir quelles activités sont à mettre à jour, insérer, supprimer :
        for(let i = 0; i < req.body.newBookedActiv.length; i++){
            if (req.body.newBookedActiv[i].activity_id && 
                req.body.oldBookedActiv[i].activity_id ) {
                // il s'agit d'une MAJ :
                const datasActUpd = {
                    nb_adults: req.body.newBookedActiv[i].nb_adults,
                    nb_children: req.body.newBookedActiv[i].nb_children,
                    price_total_act: req.body.newBookedActiv[i].price_total_act,
                    activity_id: req.body.newBookedActiv[i].activity_id,
                    booking_id: req.body.newBookedActiv[i].booking_id,
                    id: req.body.oldBookedActiv[i].id
                };
                const queryBookActUpd = "UPDATE booked_activities SET nb_adults = ?, nb_children = ?, price_total_act = ?, activity_id = ?, booking_id = ? WHERE id = ?";
                await Query.queryByObject(queryBookActUpd, datasActUpd);
            }
            else if (req.body.newBookedActiv[i].activity_id && 
                    !req.body.oldBookedActiv[i].activity_id) {
                // c'est une nouvelle act. à enregistrer  :
                delete req.body.newBookedActiv[i].name;
                const queryBookActIns = "INSERT INTO booked_activities (nb_adults, nb_children, price_total_act, activity_id, booking_id) VALUES (?, ?, ?, ?, ?)";
                await Query.queryByObject(queryBookActIns, req.body.newBookedActiv[i]);
            }
            else if (!req.body.newBookedActiv[i].activity_id && 
                    req.body.oldBookedActiv[i].activity_id) {
                // c'est l'ancienne act. à supprimer :
                const queryBookActDel = "DELETE FROM booked_activities WHERE id = ?";
                await Query.queryByValue(queryBookActDel, req.body.oldBookedActiv[i].id);
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
        const [activities] = await Query.queryByValue(queryCheckAct, req.body.id);
        // si des activités trouvées, on les supprime d'abord :
        if (activities.length) {
            const queryDeleteBooking = "DELETE FROM booked_activities WHERE booking_id = ?";
            await Query.queryByValue(queryDeleteBooking, req.body.id);
        }
        // Supprimer la réservation :
        const queryDeleteBooking = "DELETE FROM bookings WHERE id = ?";
        await Query.queryByValue(queryDeleteBooking, req.body.id);
        let msg = "réservation supprimée";
        res.status(201).json({ msg });
    } catch (err) {
        throw Error(err)
    }
}

export { 
    getAllUserBookings,
    getBookingAllData,
    createBooking,
    modifyBooking,
    deleteBooking
}