import Query from '../model/Query.js';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

        const [datas] = await Query.queryByArrayNTables(query, bodyData);

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

        const [datas] = await Query.queryByArrayNTables(query, bodyData);

        res.status(200).json({datas});
    } catch (err) {
        throw Error(err);
    }
} 

// trouver une réservation par plusieurs critères :
const getLodgingByMultiInputs = async (req, res) => {
    try {
        const query = "SELECT l.* FROM lodgings AS l WHERE l.name = ? LIMIT 1";
        const [datas] = await Query.queryByValueNTables(query, req.body.name);
        res.status(200).json({datas});
    } catch (err) {
        throw Error(err);
    }
} 
/* ----------------------- UPDATE ---------------------- */
const modifyLodging = async (req, res) => {
    const form = formidable({
        uploadDir: `public/img/lodgings`,
        keepExtensions: true,
        allowEmptyFiles: false,
        multiples: true,
    });

    form.parse(req, async (err, fields, files) => {
        try {
            let msg = "";
            const lodging = {};
    
            for (const key in fields){
                lodging[key] = fields[key][0]; 
            }
            const id = lodging.id;
            delete lodging.id;
            lodging.url_initial_image = files.file[0].newFilename;
            lodging.id = id;
            console.log(lodging);
            const queryUser = "UPDATE lodgings SET name = ?, type = ?, overview = ?, facilities = ?, rooms = ?, food_drink = ?, meal_plans = ?, entertainment = ?, children = ?, tripadvisor = ?, coordinates = ?, url_initial_image = ? WHERE id = ?";
            await Query.queryByObject(queryUser, lodging);

            msg = "hébérgement modifié";
            res.status(200).json({ msg });
        } catch (err) {
            throw Error(err)
        }
    });
}

/* ----------------------- CREATE ----------------------- */
const createLodging = async (req, res) => {
    //fs.mkdirSync(__dirname + `../../../public/img/lodgings`);
    const form = formidable({
        //uploadDir: __dirname + `../../../public/img/lodgings`,
        uploadDir: `public/img/lodgings`,
        keepExtensions: true,
        allowEmptyFiles: false,
        multiples: true,
    });

    form.parse(req, async (err, fields, files) => {
        try {
            let msg = "";
            const newLodging = {};
    
            for (const key in fields){
                newLodging[key] = fields[key][0]; 
            }
    
            // vérifier si un hébérgement avec le même nom existe déjà :
            const queryCheck = "SELECT name FROM lodgings WHERE name = ?";
            const [results] = await Query.queryByValue(queryCheck, newLodging.name);
    
            if (results.length) {
                msg = "Un hébérgement avec ce nom existe déjà !";
                res.status(409).json({ msg });
            } else if (!results.length){
                newLodging.url_initial_image = files.file[0].newFilename;
                
                const queryInsertLodg = "INSERT INTO lodgings (name, type, overview, facilities, rooms, food_drink, meal_plans, entertainment, children, tripadvisor, coordinates, url_initial_image) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
                const resultLodg = await Query.queryByObject(queryInsertLodg, newLodging);
    
                // on a besoin de récupérer l'ID de l'hébergement créé pour l'utiliser comme clé étrangère :
                const queryGetID = "SELECT id FROM lodgings ORDER BY id DESC LIMIT 1";
                const [lodgID] = await Query.find(queryGetID);
    
                // pour stocker les urls des images pour le slideshow :
                const urlArray = [];
                const images = Object.values(files);
                images.forEach((image) => {
                    const newImgObject = {
                        url_image: image[0].newFilename,
                        lodging_id: lodgID[0].id
                    }
                    urlArray.push(newImgObject);
                });
                // on en aura pas besoin de la 1ere image, car elle sert uniquement pour image initiale :
                urlArray.shift();
                console.log(urlArray);
    
                async function writeImage(imgData){
                    const queryInsertImages = "INSERT INTO lodgings_images (url_image, lodging_id) VALUES (?,?)";
                    await Query.queryByObject(queryInsertImages, imgData);
                }
                urlArray.forEach((el) => {
                    writeImage(el);
                });
    
                msg = "Merci ! L'hébérgement a été créé dans la BDD.";
                res.status(200).json({ msg });
            }
        } catch (err) {
            throw Error(err)
        }
    });
}

const createDestination = async (req, res) => {
    try {
        const form = formidable({
            uploadDir: `public/img/destinations`,
            keepExtensions: true,
            allowEmptyFiles: false,
            multiples: true,
        });

        form.parse(req, async (err, fields, files) => {
            let msg = "";
            const newDestination = {};

            for (const key in fields){
                newDestination[key] = fields[key][0]; 
            }
            console.log(newDestination);

            // vérifier si une destination avec le même nom existe déjà :
            const queryCheck = "SELECT name FROM destinations WHERE name = ?";
            const [results] = await Query.queryByValue(queryCheck, queryCheck, newDestination.name);

            if (results.length) {
                msg = "Une destination avec ce nom existe déjà !";
                res.status(409).json({ msg });
            } else if (!results.length){
                newDestination.url_initial_image = files.file[0].newFilename;

                const queryInsertDest = "INSERT INTO destinations (reference, name, country, continent, overview, departure_place, date_created, lodging_id, url_initial_image) VALUES (?,?,?,?,?,?,CURRENT_TIMESTAMP(),?,?)";
                const resultDest = await Query.queryByObject(queryInsertDest, newDestination);

                // on a besoin de récupérer l'ID de la destination créée pour l'utiliser comme clé étrangère :
                const queryGetID = "SELECT id FROM destinations ORDER BY id DESC LIMIT 1";
                const [destID] = await Query.find(queryGetID);

                // pour stocker les urls des images pour le slideshow :
                const urlArray = [];
                const images = Object.values(files);
                images.forEach((image) => {
                    const newImgObject = {
                        url_image: image[0].newFilename,
                        destination_id: destID[0].id
                    }
                    urlArray.push(newImgObject);
                });
                // on en aura pas besoin de la 1ere image, car elle sert uniquement pour image initiale :
                urlArray.shift();
                console.log(urlArray);

                async function writeImage(imgData){
                    const queryInsertImages = "INSERT INTO destinations_images (url_image, destination_id) VALUES (?,?)";
                    await Query.queryByObject(queryInsertImages, imgData);
                }
                urlArray.forEach((el) => {
                    writeImage(el);
                });

                msg = "Merci ! La destination a été créée dans la BDD.";
                res.status(200).json({ msg });
            }
        });
    } catch (err) {
        throw Error(err)
    }
}

const createPack = async (req, res) => {
    try {
        const form = formidable({
            uploadDir: `public/img`,
            keepExtensions: true,
            allowEmptyFiles: false,
            multiples: true,
        });

        form.parse(req, async (err, fields, files) => {
            
            let msg = "";
            const newPack = {};

            for (const key in fields){
                newPack[key] = fields[key][0]; 
            }
            console.log(newPack);

            const queryInsert = "INSERT INTO packs (reference, departure_date, return_date, duration, price_adults, price_children, discount, places_total, places_left, destination_id) VALUES (?,?,?,?,?,?,?,?,?,?)";
            await Query.queryByObject(queryInsert, newPack);
    
            msg = "Merci ! Le pack a été créé dans la BDD.";
            res.status(200).json({ msg });
        });
    } catch (err) {
        throw Error(err)
    }
}

const createActivity= async (req, res) => {
    try {
        let msg = "";

        // on vérifie si une activité avec le même nom existe déjà :
        const queryCheck = "SELECT id FROM activities WHERE name = ?";
        const [results] = await Query.queryByValue(queryCheck, req.body.nameAct);

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
            await Query.queryByObject(queryInsertAct, datas);
            // récupérer l'ID de l'activité insérée 
            const queryGetID = "SELECT id FROM activities WHERE name = ?";
            const [activityData] = await Query.queryByValue(queryGetID, req.body.nameAct);
            console.log(activityData[0].id);
            // insérer l'activité (via son ID) dans le tableau 'destinations_activities' afin d'associer l'activité à la destination
            const dataArray = [activityData[0].id, req.body.destinationID];
            const queryInsertDestAct = "INSERT INTO destinations_activities (activity_id, destination_id) VALUES (?,?)";
            await Query.queryByArray(queryInsertDestAct, dataArray);
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
        // vérifier si la destination est déjà supprimée :
        const queryCheck = "SELECT id FROM destinations WHERE lodging_id = ?";
        const [results] = await Query.queryByValue(queryCheck, req.body.id);
        console.log(results);
        console.log(results.length);
        if (results.length) {
            console.log("trouvée");
            msg = "Veuillez supprimer d'abord la destination liée à cet hébergement.";
            res.status(409).json({ msg });
        } else if (!results.length){
            console.log("PAS trouvée - OK");
            // supprimer les images d'abord
            const queryLodgImg = "DELETE FROM lodgings_images WHERE lodging_id = ?";
            await Query.queryByValue(queryLodgImg, req.body.id);
            // supprimer l'hébérgement
            const queryLodg = "DELETE FROM lodgings WHERE id = ?";
            await Query.queryByValue(queryLodg, req.body.id);
            msg = "hébérgement supprimé";
            res.status(200).json({ msg });
        }
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