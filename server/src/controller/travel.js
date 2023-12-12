import Query from "../model/Query.js";

// tous les contnents & destinations :
const getAllContinentsAndDestinations = async (req, res) => {
    const query = "SELECT name, country, continent, country, url_initial_image FROM destinations ORDER BY name";
    const [datas] = await Query.find(query);
    res.status(200).json({datas});
}
// tous les contnents :
const getAllContinents = async (req, res) => {
    const query = "SELECT DISTINCT continent FROM destinations ORDER BY continent";
    const [datas] = await Query.find(query);
    res.status(200).json({datas});
}
// toutes les destinations :
const getAllDestinations = async (req, res) => {
    const query = "SELECT DISTINCT name FROM destinations ORDER BY name";
    const [datas] = await Query.find(query);
    res.status(200).json({datas});
}


// cherche une destination dont les packs correspondent aux critères de la barre de recherche :
const getAllDataIfPacks = async (req, res) => {
    //console.log(req.body);
    const queryDest = "SELECT * FROM destinations WHERE name = ?";
    const [datasDest] = await Query.findByValue(queryDest, req.body.searchDestination);

    // pour faire une recherche nb d'inputs dynamique :
    let queryEnding = "";
    const bodyData = [datasDest[0].id];
    //console.log(bodyData);

    if (req.body.departureDate !== ''){
        queryEnding += " AND departure_date >= ?";
        bodyData.push(req.body.departureDate);
    }
    if (req.body.maxPrice !== ''){
        queryEnding += " AND price_adults <= ?";
        bodyData.push(req.body.maxPrice);
    }
    //console.log("queryEnding = "+queryEnding);

    const queryPacks = "SELECT * FROM packs WHERE destination_id = ?" + queryEnding + " ORDER BY departure_date";
    //console.log("queryPacks = "+queryPacks);
    const [datasPacks] = await Query.findByArrayDatas(queryPacks, bodyData);

    const queryLodg = "SELECT * FROM lodgings WHERE id = ?";
    const [datasLodg] = await Query.findByValue(queryLodg, datasDest[0].lodging_id);

    const queryDestImg = "SELECT url_image FROM destinations_images WHERE destination_id = ?";
    const [datasDestImg] = await Query.findByValue(queryDestImg, datasDest[0].id);

    const queryLodgImg = "SELECT url_image FROM lodgings_images WHERE lodging_id = ?";
    const [datasLodgImg] = await Query.findByValue(queryLodgImg, datasLodg[0].id);

    res.status(200).json({ msg: "packs trouvés", 
                           datasDest,
                           datasPacks,
                           datasLodg,
                           datasDestImg,
                           datasLodgImg })
}

// cherche une destination avec tous les packs :
const getAllDataAllPacks = async (req, res) => {
    // récupérer les données de la destination et de l'hébérgement :
    const queryDest = "SELECT * FROM destinations WHERE name = ?";
    const [datasDest] = await Query.findByValue(queryDest, req.params.name);

    // récupérer les données des packs :
    const queryPacks = "SELECT * FROM packs WHERE destination_id = ?";
    const [datasPacks] = await Query.findByValue(queryPacks, datasDest[0].id);

    const queryLodg = "SELECT * FROM lodgings WHERE id = ?";
    const [datasLodg] = await Query.findByValue(queryLodg, datasDest[0].lodging_id);

    const queryDestImg = "SELECT url_image FROM destinations_images WHERE destination_id = ?";
    const [datasDestImg] = await Query.findByValue(queryDestImg, datasDest[0].id);

    const queryLodgImg = "SELECT url_image FROM lodgings_images WHERE lodging_id = ?";
    const [datasLodgImg] = await Query.findByValue(queryLodgImg, datasLodg[0].id);

    res.status(200).json({ msg: "packs trouvés",  
                           datasDest,
                           datasPacks,
                           datasLodg,
                           datasDestImg,
                           datasLodgImg });
}

// cherche une destination avec tous les packs :
const getPackAllData = async (req, res) => {
    // récupérer les données de la destination et de l'hébérgement :
    const queryPacks = "SELECT * FROM packs WHERE id = ?";
    const [datasPacks] = await Query.findByValue(queryPacks, req.params.id);

    // récupérer les données de la destination :
    const queryDest = "SELECT * FROM destinations WHERE id = ?";
    const [datasDest] = await Query.findByValue(queryDest, datasPacks[0].destination_id);

    // récupérer les données de l'hébérgement :
    const queryLodg = "SELECT * FROM lodgings WHERE id = ?";
    const [datasLodg] = await Query.findByValue(queryLodg, datasDest[0].lodging_id);

    // récupérer les données des activités :
    const queryAct = "SELECT * FROM activities AS a JOIN destinations_activities AS da ON a.id = da.activity_id WHERE da.destination_id = ?";
    const [datasAct] = await Query.findByValue(queryAct, datasPacks[0].destination_id);

    res.status(200).json({ msg: "pack trouvé",  
                           datasPacks,
                           datasDest,
                           datasLodg,
                           datasAct });
}

// chercher une destination par nom :
const getDestinationByName = async (req, res) => {
    const query = "SELECT id, reference, name, country, continent, overview, departure_place, url_initial_image, lodging_id FROM destinations WHERE name = ?";
    const [datas] = await Query.findByValue(query, req.params.name);
    res.status(200).json({ msg: "destination trouvée", datas })
}
// toutes les images de la destination :
const getImagesDestination = async (req, res) => {
    const query = "SELECT id, name, url_image FROM destinations_images WHERE destination_id = ?";
    const [datas] = await Query.findByValue(query, req.params.id);
    res.status(200).json({ msg: "images trouvées", datas })
}
// toutes les images de l'hébérgement :
const getImagesLodging = async (req, res) => {
    const query = "SELECT id, name, url_image FROM lodgings_images WHERE lodging_id = ?";
    const [datas] = await Query.findByValue(query, req.params.id);
    res.status(200).json({ msg: "images trouvées", datas })
} 
// chercher un hébérgement par ID :
const getLodgingById = async (req, res) => {
    const query = "SELECT * FROM lodgings WHERE id = ?";
    const [datas] = await Query.findByValue(query, req.params.id);
    res.status(200).json({ msg: "hébérgement trouvé", datas })
}
// chercher un pack par ID de destination :
const getPacksByDestination = async (req, res) => {
    const query = "SELECT * FROM packs WHERE destination_id = ?";
    const [datas] = await Query.findByValue(query, req.params.id);
    res.status(200).json({ msg: "packs trouvés", datas })
}
// chercher une activité par ID de destination :
const getActivitiesByDestination = async (req, res) => {
    const query = "SELECT * FROM activities AS a JOIN destinations_activities AS da ON a.id = da.activity_id WHERE da.destination_id = ?";
    const [datas] = await Query.findByValue(query, req.params.id);
    res.status(200).json({ msg: "activités trouvées", datas })
}
// le pack "Best Promo" (celui avec la plus grande réduction) :
const getBestPromoPack = async (req, res) => {
    console.log("best promo");
    const query = "SELECT d.name, d.country, d.url_initial_image, p.discount, p.price_adults, p.id AS pack_id FROM packs AS p JOIN destinations AS d ON d.id = p.destination_id WHERE p.discount = (SELECT MAX(discount) FROM packs ORDER BY price_adults LIMIT 1)";
    const [datas] = await Query.find(query);
    console.log(datas);
    res.status(200).json({datas});
}
// les 3 destinations avec la plus grande réduction sur les packs :
const getBestThreePromoPacks = async (req, res) => {
    const query = "SELECT d.name, d.country, d.url_initial_image, p.discount, p.price_adults, MAX(p.discount) AS max_discount FROM packs AS p JOIN destinations AS d ON d.id = p.destination_id GROUP BY p.destination_id ORDER BY max_discount DESC LIMIT 3";
    const [datas] = await Query.find(query);
    res.status(200).json({datas});
}
// la "Top" destination (la plus réservée) :
const getTopDestination = async (req, res) => {
    const query = "SELECT d.name, d.country, d.url_initial_image, p.discount, p.price_adults, pack_id AS the_pack, COUNT(pack_id) AS most FROM bookings AS b JOIN packs AS p ON p.id = b.pack_id JOIN destinations AS d ON d.id = p.destination_id GROUP BY pack_id ORDER BY most DESC LIMIT 1";
    const [datas] = await Query.find(query);
    res.status(200).json({datas});
}
// la "Top" destination (la plus réservée) :
const getTopThreeDestinations = async (req, res) => {
    const query = "SELECT d.name, d.country, d.url_initial_image, p.discount, p.price_adults, COUNT(DISTINCT b.id) AS total_bookings FROM `bookings` b JOIN `packs` p ON b.pack_id = p.id JOIN `destinations` d ON p.destination_id = d.id GROUP BY d.name ORDER BY total_bookings DESC LIMIT 3";
    const [datas] = await Query.find(query);
    res.status(200).json({datas});
}

export { 
    getAllContinentsAndDestinations,
    getAllContinents,
    getAllDestinations,
    getAllDataIfPacks,
    getAllDataAllPacks,
    getPackAllData,
    getDestinationByName,
    getImagesDestination,
    getImagesLodging,
    getLodgingById,
    getPacksByDestination,
    getActivitiesByDestination,
    getBestPromoPack,
    getBestThreePromoPacks,
    getTopDestination,
    getTopThreeDestinations
};