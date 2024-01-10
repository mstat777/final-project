import Query from '../model/Query.js';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ------------------------- READ ------------------------- */
const getAllLodgingsID = async (req, res) => {
    const query = "SELECT id, name FROM lodgings ORDER BY id DESC";
    const [datas] = await Query.find(query);
    res.status(200).json({datas});
}

const getAllDestinationsID = async (req, res) => {
    const query = "SELECT id, name FROM destinations ORDER BY id DESC";
    const [datas] = await Query.find(query);
    res.status(200).json({datas});
}

// trouver une DESTINATION par plusieurs critères :
const getDestinationByMultiInputs = async (req, res) => {
    try {
        let queryEnding = "";
        let areMultipleInputs = false;
        const bodyData = [];

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
    
        const query = "SELECT d.* FROM destinations AS d WHERE"+queryEnding;
        const [datas] = await Query.queryByArrayNTables(query, bodyData);
        res.status(200).json({datas});
    } catch (err) {
        throw Error(err);
    }
} 

// trouver une RÉSERVATION par plusieurs critères :
const getLodgingByMultiInputs = async (req, res) => {
    try {
        const query = "SELECT l.* FROM lodgings AS l WHERE l.name = ? LIMIT 1";
        const [datas] = await Query.queryByValueNTables(query, req.body.name);
        res.status(200).json({datas});
    } catch (err) {
        throw Error(err);
    }
} 

// trouver un PACK par plusieurs critères :
const getPackByMultiInputs = async (req, res) => {
    try {
        const queryDest = "SELECT id FROM destinations WHERE name = ?";
        const [dataDest] = await Query.queryByValue(queryDest, req.body.name);
        if (dataDest.length) {
            const queryPacks = "SELECT p.* FROM packs AS p WHERE p.destination_id = ?";
            const [datas] = await Query.queryByValueNTables(queryPacks, dataDest[0].id);
            if (datas.length) {
                res.status(200).json({datas});
            } else {
                const msg = "Aucun pack trouvé pour cette destination";
                res.status(404).json({msg});
            }
        } else {
            const msg = "Cette destination n'a pas été trouvée";
            res.status(404).json({ msg });
        }
    } catch (err) {
        throw Error(err);
    }
} 

// trouver un UTILISATEUR par plusieurs critères :
const getActivityByMultiInputs = async (req, res) => {
    try {
        let queryEnding = "";
        let areMultipleInputs = false;
        const bodyData = [];

        if (req.body.name !== ''){
            if (areMultipleInputs) { queryEnding += " AND"; }
            queryEnding += " a.name = ?";
            bodyData.push(req.body.name);
            areMultipleInputs = true;
        }
        if (req.body.type !== ''){
            if (areMultipleInputs) { queryEnding += " AND"; }
            queryEnding += " a.type = ?";
            bodyData.push(req.body.type);
            areMultipleInputs = true;
        }

        const query = "SELECT a.*, da.destination_id FROM activities AS a JOIN destinations_activities AS da ON da.activity_id = a.id WHERE"+queryEnding;
        const [datas] = await Query.queryByArrayNTables(query, bodyData);

        res.status(200).json({datas});
    } catch (err) {
        throw Error(err);
    }
}

// trouver un UTILISATEUR par plusieurs critères :
const getUserByMultiInputs = async (req, res) => {
    try {
        let queryEnding = "";
        let areMultipleInputs = false;
        const bodyData = [];

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

        const query = "SELECT u.first_name, u.last_name, u.email, u.tel, u.address, u.birth_date, u.occupation, u.date_created FROM users AS u WHERE"+queryEnding;
        const [datas] = await Query.queryByArrayNTables(query, bodyData);

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
        multiples: true
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
            //console.log(lodging);
            const query = "UPDATE lodgings SET name = ?, type = ?, overview = ?, facilities = ?, rooms = ?, food_drink = ?, meal_plans = ?, entertainment = ?, children = ?, tripadvisor = ?, coordinates = ?, url_initial_image = ? WHERE id = ?";
            await Query.queryByObject(query, lodging);
            msg = "hébérgement modifié";
            res.status(200).json({ msg });
        } catch (err) {
            throw Error(err)
        }
    });
}

const modifyDestination = async (req, res) => {
    const form = formidable({
        uploadDir: `public/img/destinations`,
        keepExtensions: true,
        allowEmptyFiles: false,
        multiples: true
    });
    form.parse(req, async (err, fields, files) => {
        try {
            let msg = "";
            const destination = {};
    
            for (const key in fields){
                destination[key] = fields[key][0]; 
            }
            const id = destination.id;
            delete destination.id;
            destination.url_initial_image = files.file[0].newFilename;
            destination.id = id;
            //console.log(destination);
            const query = "UPDATE destinations SET reference = ?, name = ?, country = ?, continent = ?, overview = ?, departure_place = ?, lodging_id = ?, url_initial_image = ? WHERE id = ?";
            await Query.queryByObject(query, destination);
            msg = "destination modifiée";
            res.status(200).json({ msg });
        } catch (err) {
            throw Error(err)
        }
    });
}

const modifyPack = async (req, res) => {
    const form = formidable();
    form.parse(req, async (err, fields, files) => {
        try {
            let msg = "";
            const pack = {};
            for (const key in fields){
                pack[key] = fields[key][0]; 
            }
            const query = "UPDATE packs SET reference = ?, departure_date = ?, return_date = ?, duration = ?, price_adults = ?, price_children = ?, discount = ?, places_total = ?, places_left = ?, destination_id = ? WHERE id = ?";
            await Query.queryByObject(query, pack);
            msg = "pack modifié";
            res.status(200).json({ msg });
        } catch (err) {
            throw Error(err)
        }
    });
}

const modifyActivity = async (req, res) => {
    const form = formidable();
    form.parse(req, async (err, fields, files) => {
        try {
            let msg = "";
            const activity = {};
            for (const key in fields){
                activity[key] = fields[key][0]; 
            }
            const query = "UPDATE activities SET name = ?, type = ?, overview = ?, price_adults = ?, price_children = ?, places_total = ?, places_left = ? WHERE id = ?";
            await Query.queryByObject(query, activity);
            msg = "activité modifiée";
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
        let msg = "";
        const form = formidable();
        form.parse(req, async (err, fields, files) => {
            const newPack = {};
            for (const key in fields){
                newPack[key] = fields[key][0]; 
            }
            console.log(newPack);
            const query = "INSERT INTO packs (reference, departure_date, return_date, duration, price_adults, price_children, discount, places_total, places_left, destination_id) VALUES (?,?,?,?,?,?,?,?,?,?)";
            await Query.queryByObject(query, newPack);
    
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
        const form = formidable();
        form.parse(req, async (err, fields, files) => {
            const newAct = {};
            for (const key in fields){
                newAct[key] = fields[key][0]; 
            }
            // insérer l'activité dans la BDD
            const queryInsertAct = "INSERT INTO activities (name, type, overview, price_adults, price_children, places_total, places_left) VALUES (?,?,?,?,?,?,?)";
            await Query.queryByObject(queryInsertAct, newAct);
            // récupérer l'ID de l'activité insérée 
            const queryGetID = "SELECT id FROM activities WHERE name = ?";
            const [activityData] = await Query.queryByValue(queryGetID, newAct.name);
            // insérer l'activité (via son ID) dans le tableau 'destinations_activities' pour l'associer à la destination correspondante
            const dataArray = [activityData[0].id, newAct.destination_id];
            const queryInsertDestAct = "INSERT INTO destinations_activities (activity_id, destination_id) VALUES (?,?)";
            await Query.queryByArray(queryInsertDestAct, dataArray);
            // si tout est OK :
            msg = "Merci ! L'activité' a été créée dans la BDD.";
            res.status(200).json({ msg });
        });
    } catch (err) {
        throw Error(err)
    }
}

/* ----------------------- DELETE ----------------------- */
const deleteLodging = async (req, res) => {
    try {
        let msg = "";
        // vérifier si la destination est déjà supprimée :
        const queryCheck = "SELECT id FROM destinations WHERE lodging_id = ?";
        const [results] = await Query.queryByValue(queryCheck, req.body.id);
        if (results.length) {
            msg = "Veuillez supprimer d'abord la destination liée à cet hébergement.";
            res.status(409).json({ msg });
        } else if (!results.length){
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

const deleteDestination = async (req, res) => {
    try {
        let msg = "";
        // !!! Il faut que les packs et les activités associées soient tous supprimés. On vérifie:
        const queryCheckPack = "SELECT id FROM packs WHERE destination_id = ?";
        const [packs] = await Query.queryByValue(queryCheckPack, req.body.id);
        const queryCheckAct = "SELECT activity_id FROM destinations_activities WHERE destination_id = ?";
        const [activities] = await Query.queryByValue(queryCheckAct, req.body.id);
        if (packs.length || activities.length) {
            msg = "Il existe des packs/activités associés à cette destination. Veuillez les supprimer d'abord afin de pouvoir supprimer la destination !";
            res.status(409).json({ msg });
        } else {
            // supprimer les images d'abord
            const queryDestImg = "DELETE FROM destinations_images WHERE destination_id = ?";
            await Query.queryByValue(queryDestImg, req.body.id);
            // supprimer la destination
            const queryDest= "DELETE FROM destinations WHERE id = ?";
            await Query.queryByValue(queryDest, req.body.id);
            msg = "destination supprimée";
            res.status(200).json({ msg });
        }
    } catch (err) {
        throw Error(err)
    }
}

const deletePack = async (req, res) => {
    try {
        const query = "DELETE FROM packs WHERE id = ?";
        await Query.queryByValue(query, req.body.id);
        const msg = "pack supprimé";
        res.status(200).json({ msg });
    } catch (err) {
        throw Error(err)
    }
}

const deleteActivity = async (req, res) => {
    try {
        // supprimer d'abord de la table 'destinations_activities':
        const queryDestAct = "DELETE FROM destinations_activities WHERE activity_id = ?";
        await Query.queryByValue(queryDestAct, req.body.id);
        // puis supprimer de la table 'activities':
        const queryAct = "DELETE FROM activities WHERE id = ?";
        await Query.queryByValue(queryAct, req.body.id);
        const msg = "activité supprimée";
        res.status(200).json({ msg });
    } catch (err) {
        throw Error(err)
    }
}

export { 
        getAllLodgingsID,
        getAllDestinationsID,
        getLodgingByMultiInputs,
        getDestinationByMultiInputs,
        getPackByMultiInputs,
        getActivityByMultiInputs,
        getUserByMultiInputs,

        modifyLodging,
        modifyDestination,
        modifyPack,
        modifyActivity,

        createLodging,
        createDestination,
        createPack,
        createActivity,

        deleteLodging,
        deleteDestination,
        deletePack,
        deleteActivity
};