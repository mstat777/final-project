import Query from "../model/Query.js";

// trouver une réservation par le nom de l'utilisateur (A SUPPRIMER) :
const getBookingByLastName = async (req, res) => {
    const query = "SELECT b.id, b.nb_adults, b.nb_children, b.price_total_booking, b.payment_type, b.status, b.date_created, u.first_name, u.last_name, u.email, u.tel, p.reference, p.departure_date, p.return_date, p.duration, d.name, d.country, d.departure_place FROM bookings AS b JOIN users AS u ON u.id = b.user_id JOIN packs AS p ON p.id = b.pack_id JOIN destinations AS d ON d.id = p.destination_id WHERE u.last_name = ?";
    const [datas] = await Query.findByValue(query, req.params.name);
    res.status(200).json({datas});
} 
// trouver une réservation par plusieurs critères :
const getBookingByMultipleInputs = async (req, res) => {
    try {
        /*let queryEnding = "";
        let areMultipleInputs = false;*/
        console.log("req.body.lastName = "+req.body.lastName);
        /*const inputsObject = {
            lastName: req.body.lastName, 
            firstName: req.body.firstName,
            email: req.body.email,
            reference: req.body.reference,
            bookingDate: req.body.bookingDate
        }*/
        //const inputsObject = req.body.inputStates;
/*
        if (req.body.lastName !== ""){
        if (areMultipleInputs) { queryEnding += " AND"; }
        queryEnding += " u.last_name = ?";
        areMultipleInputs = true;
        } else if (req.body.firstName !== ""){
        if (areMultipleInputs) { queryEnding += " AND"; }
        queryEnding += " u.firstName = ?";
        areMultipleInputs = true;
        } else if (req.body.email !== ""){
        if (areMultipleInputs) { queryEnding += " AND"; }
        queryEnding += " u.email = ?";
        areMultipleInputs = true;
        } else if (req.body.reference !== ""){
        if (areMultipleInputs) { queryEnding += " AND"; }
        queryEnding += " p.reference = ?";
        areMultipleInputs = true;
        } else if (req.body.bookingDate !== ""){
        if (areMultipleInputs) { queryEnding += " AND"; }
        queryEnding += " b.date_created = ?";
        areMultipleInputs = true;
        }
        console.log("queryEnding = "+queryEnding);
        const query = "SELECT b.id, b.nb_adults, b.nb_children, b.price_total_booking, b.payment_type, b.status, b.date_created, u.first_name, u.last_name, u.email, u.tel, p.reference, p.departure_date, p.return_date, p.duration, d.name, d.country, d.departure_place FROM bookings AS b JOIN users AS u ON u.id = b.user_id JOIN packs AS p ON p.id = b.pack_id JOIN destinations AS d ON d.id = p.destination_id WHERE"+queryEnding;
        console.log("query = "+query);
        const query = "SELECT b.id, b.nb_adults, b.nb_children, b.price_total_booking, b.payment_type, b.status, b.date_created, u.first_name, u.last_name, u.email, u.tel, p.reference, p.departure_date, p.return_date, p.duration, d.name, d.country, d.departure_place FROM bookings AS b JOIN users AS u ON u.id = b.user_id JOIN packs AS p ON p.id = b.pack_id JOIN destinations AS d ON d.id = p.destination_id WHERE u.last_name = ?";*/
        const query = "SELECT * FROM users WHERE last_name = ?";
        const [datas] = await Query.findByValue(query, req.body.lastName);
        res.status(200).json({datas});
    } catch (err) {
        throw Error(err);
    }
} 

const createLodging = async (req, res) => {
    try {
        let msg = "";
        const queryCheck = "SELECT name FROM lodgings WHERE name = ?";
        const [results] = await Query.findByValue(queryCheck, req.body.nameLodg);
        // garder juste le nom de fichier
        let temp = req.body.urlInitialImage;
        req.body.urlInitialImage = temp.slice(temp.lastIndexOf('\\')+1);
        //console.log("req.body.urlInitialImage = " + req.body.urlInitialImage);

        console.log(req.body);
        //console.log(results[0]);

        if (results.length) {
            msg = "un hébérgement avec ce nom existe déjà";
            res.status(409).json({ msg });
        } else if (!results.length){

            const queryInsert = "INSERT INTO lodgings (name, type, overview, facilities, rooms, food_drink, meal_plans, entertainment, children, url_initial_image, tripadvisor, coordinates) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
            await Query.write(queryInsert, req.body);

            msg = "Merci ! L'hébérgement a été créé dans la BDD.";
            res.status(200).json({ msg });
        }
    } catch (err) {
        throw Error(err)
    }
}

const getAllLodgingsID = async (req, res) => {
    const query = "SELECT id, name FROM lodgings";
    const [datas] = await Query.find(query);
    res.status(200).json({datas});
}

const createDestination = async (req, res) => {
    try {
        let msg = "";
        const queryCheck = "SELECT name FROM destinations WHERE name = ?";
        const [results] = await Query.findByValue(queryCheck, req.body.nameDest);
        // garder juste le nom de fichier
        let temp = req.body.urlInitialImage;
        req.body.urlInitialImage = temp.slice(temp.lastIndexOf('\\')+1);

        if (results.length) {
            msg = "un hébérgement avec ce nom existe déjà";
            res.status(409).json({ msg });
        } else if (!results.length){
            const queryInsert = "INSERT INTO destinations (reference, name, country, continent, overview, departure_place, url_initial_image, date_created, lodging_id) VALUES (?,?,?,?,?,?,?,CURRENT_TIMESTAMP(),?)";
            await Query.write(queryInsert, req.body);

            msg = "Merci ! La destination a été créée dans la BDD.";
            res.status(200).json({ msg });
        }
    } catch (err) {
        throw Error(err)
    }
}


export { getBookingByLastName,
        getBookingByMultipleInputs,
        createLodging,
        getAllLodgingsID,
        createDestination
};