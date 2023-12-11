import Query from "../model/Query.js";

/* ------------------------- READ ------------------------- */
const getAllLodgingsID = async (req, res) => {
    const query = "SELECT id, name FROM lodgings";
    const [datas] = await Query.find(query);
    res.status(200).json({datas});
}

const getAllDestinationsID = async (req, res) => {
    const query = "SELECT id, name FROM destinations";
    const [datas] = await Query.find(query);
    res.status(200).json({datas});
}

// trouver une réservation par plusieurs critères :
const getBookingByMultiInputs = async (req, res) => {
    try {
        let queryEnding = "";
        let areMultipleInputs = false;
        const bodyData = [];
        //console.log(req.body);

        if (req.body.lastName !== ''){
            if (areMultipleInputs) { queryEnding += " AND"; }
            queryEnding += " u.last_name = ?";
            bodyData.push(req.body.lastName);
            areMultipleInputs = true;
        }
        if (req.body.firstName !== ''){
            if (areMultipleInputs) { queryEnding += " AND"; }
            queryEnding += " u.first_name = ?";
            bodyData.push(req.body.firstName);
            areMultipleInputs = true;
        }
        if (req.body.email !== ''){
            if (areMultipleInputs) { queryEnding += " AND"; }
            queryEnding += " u.email = ?";
            bodyData.push(req.body.email);
            areMultipleInputs = true;
        }
        if (req.body.reference !== ''){
            if (areMultipleInputs) { queryEnding += " AND"; }
            queryEnding += " p.reference = ?";
            bodyData.push(req.body.reference);
            areMultipleInputs = true;
        }
        if (req.body.bookingDate !== ''){
            if (areMultipleInputs) { queryEnding += " AND"; }
            queryEnding += " b.date_created = ?";
            bodyData.push(req.body.bookingDate);
            areMultipleInputs = true;
        }
    
        const query = "SELECT b.id, b.nb_adults, b.nb_children, b.price_total_booking, b.payment_type, b.status, b.date_created, u.first_name, u.last_name, u.email, u.tel, p.reference, p.departure_date, p.return_date, p.duration, d.name, d.country, d.departure_place FROM bookings AS b JOIN users AS u ON u.id = b.user_id JOIN packs AS p ON p.id = b.pack_id JOIN destinations AS d ON d.id = p.destination_id WHERE"+queryEnding;

        const [datas] = await Query.findByArrayDatasNTables(query, bodyData);

        res.status(200).json({datas});
    } catch (err) {
        throw Error(err);
    }
} 

// trouver une réservation par plusieurs critères :
const getDestinationByMultiInputs = async (req, res) => {
    try {
        let queryEnding = "";
        let areMultipleInputs = false;
        const bodyData = [];
        //console.log(req.body);

        if (req.body.name !== ''){
            if (areMultipleInputs) { queryEnding += " AND"; }
            queryEnding += " d.name = ?";
            bodyData.push(req.body.name);
            areMultipleInputs = true;
        }
        if (req.body.reference !== ''){
            if (areMultipleInputs) { queryEnding += " AND"; }
            queryEnding += " d.reference = ?";
            bodyData.push(req.body.reference);
            areMultipleInputs = true;
        }
    
        const query = "SELECT d.reference, d.name, d.country, d.continent, d.overview, d.departure_place, d.date_created FROM destinations AS d WHERE"+queryEnding;

        const [datas] = await Query.findByArrayDatasNTables(query, bodyData);

        res.status(200).json({datas});
    } catch (err) {
        throw Error(err);
    }
} 

// trouver une réservation par plusieurs critères :
const getLodgingByMultiInputs = async (req, res) => {
    try {
        const query = "SELECT l.* FROM lodgings AS l WHERE l.name = ? LIMIT 1";
        const [datas] = await Query.findByValueNTables(query, req.body.name);
        res.status(200).json({datas});
    } catch (err) {
        throw Error(err);
    }
} 
/* ----------------------- UPDATE ---------------------- */
const modifyLodging = async (req, res) => {
    try {
        let msg = "";
        //console.log(req.body);
        const queryUser = "UPDATE lodgings SET name = ?, type = ?, overview = ?, facilities = ?, rooms = ?, food_drink = ?, meal_plans = ?, entertainment = ?, children = ?, tripadvisor = ?, coordinates = ? WHERE id = ?";
        //const queryUser = "UPDATE lodgings SET name = 'test-changé', type = 'a1', overview = 'a1', facilities = 'a1', rooms = 'a1', food_drink = 'a1', meal_plans = 'a1', entertainment = 'a1', children = 'a1', tripadvisor = 'a1', coordinates = 'a1' WHERE id = 8";
        await Query.update(queryUser, req.body);
        msg = "hébérgement modifié";
        res.status(201).json({ msg });
    } catch (err) {
        throw Error(err)
    }
}

/* ----------------------- CREATE ----------------------- */
const createLodging = async (req, res) => {
    try {
        let msg = "";

        // vérifier si un hébérgement avec le même nom existe déjà :
        const queryCheck = "SELECT name FROM lodgings WHERE name = ?";
        const [results] = await Query.findByValue(queryCheck, req.body.nameLodg);

        // garder juste le nom et le format de fichier pour l'URL avant de l'insérer dans la BDD :
        let temp = req.body.urlInitialImage;
        req.body.urlInitialImage = temp.slice(temp.lastIndexOf('\\')+1);
        //console.log("req.body.urlInitialImage = " + req.body.urlInitialImage);

        //console.log(req.body);
        //console.log(results[0]);

        if (results.length) {
            msg = "Un hébérgement avec ce nom existe déjà !";
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

const createDestination = async (req, res) => {
    try {
        let msg = "";

        // vérifier si une destination avec le même nom existe déjà :
        const queryCheck = "SELECT name FROM destinations WHERE name = ?";
        const [results] = await Query.findByValue(queryCheck, req.body.nameDest);

        // garder juste le nom et le format de fichier pour l'URL avant de l'insérer dans la BDD :
        let temp = req.body.urlInitialImage;
        req.body.urlInitialImage = temp.slice(temp.lastIndexOf('\\')+1);

        if (results.length) {
            msg = "Une destination avec ce nom existe déjà !";
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

const createPack = async (req, res) => {
    try {
        let msg = "";

        // on vérifie si un pack avec les mêmes dates existe déjà :
        const datas = {
            destinationID: req.body.destinationID,
            departureDate: req.body.departureDate,
            returnDate: req.body.returnDate
        };
        const queryCheck = "SELECT id FROM packs WHERE destination_id = ? AND departure_date = ? AND return_date = ?";
        const [results] = await Query.findByDatas(queryCheck, datas);

        if (results.length) {
            msg = "Un pack avec ces dates existe déjà pour cette destination !";
            res.status(409).json({ msg });
        } else if (!results.length){
            const queryInsert = "INSERT INTO packs (reference, departure_date, return_date, duration, price_adults, price_children, discount, places_total, places_left, destination_id) VALUES (?,?,?,?,?,?,?,?,?,?)";
            await Query.write(queryInsert, req.body);

            msg = "Merci ! Le pack a été créé dans la BDD.";
            res.status(200).json({ msg });
        }
    } catch (err) {
        throw Error(err)
    }
}

const createActivity= async (req, res) => {
    try {
        let msg = "";

        // on vérifie si une activité avec le même nom existe déjà :
        const queryCheck = "SELECT id FROM activities WHERE name = ?";
        const [results] = await Query.findByValue(queryCheck, req.body.nameAct);

        if (results.length) {
            msg = "Un activité avec ce nome existe déjà !";
            res.status(409).json({ msg });

        } else if (!results.length){
            // insérer l'activité dans la BDD
            const datas = {
                nameAct: req.body.nameAct,
                typeAct: req.body.typeAct,
                overview: req.body.overview,
                priceAdults: req.body.priceAdults,
                priceChildren: req.body.priceChildren,
                placesTotal: req.body.placesTotal,
                placesLeft: req.body.placesLeft
            };
            const queryInsertAct = "INSERT INTO activities (name, type, overview, price_adults, price_children, places_total, places_left) VALUES (?,?,?,?,?,?,?)";
            await Query.write(queryInsertAct, datas);
            // récupérer l'ID de l'activité insérée 
            const queryGetID = "SELECT id FROM activities WHERE name = ?";
            const [activityData] = await Query.findByValue(queryGetID, req.body.nameAct);
            console.log(activityData[0].id);
            // insérer l'activité (via son ID) dans le tableau 'destinations_activities' afin d'associer l'activité à la destination
            const dataArray = [activityData[0].id, req.body.destinationID];
            const queryInsertDestAct = "INSERT INTO destinations_activities (activity_id, destination_id) VALUES (?,?)";
            await Query.writeWithArray(queryInsertDestAct, dataArray);
            // si tout est OK :
            msg = "Merci ! L'activité' a été créée dans la BDD.";
            res.status(200).json({ msg });
        }
    } catch (err) {
        throw Error(err)
    }
}

/* ----------------------- DELETE ----------------------- */
// supprimer un hébérgement
const deleteLodging = async (req, res) => {
    try {
        let msg = "";
        //console.log(req.body.id);
        const queryUser = "DELETE FROM lodgings WHERE id = ?";
        await Query.delete(queryUser, req.body.id);
        msg = "hébérgement supprimé";
        res.status(201).json({ msg });
    } catch (err) {
        throw Error(err)
    }
}

export { 
        getAllLodgingsID,
        getAllDestinationsID,
        getBookingByMultiInputs,
        getDestinationByMultiInputs,
        getLodgingByMultiInputs,

        modifyLodging,

        createLodging,
        createDestination,
        createPack,
        createActivity,

        deleteLodging
};