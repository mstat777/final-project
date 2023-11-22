import Query from "../model/Query.js";

// tous les contnents & destinations :
const getAllContinentsAndDestinations = async (req, res) => {
    const query = "SELECT name, continent FROM destinations ORDER BY name";
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
// la "Top" destination (la plus réservée) :
const getTopDestination = async (req, res) => {
    const query = "SELECT d.*, pack_id AS the_pack, COUNT(pack_id) AS most FROM bookings AS b JOIN packs AS p ON p.id = b.pack_id JOIN destinations AS d ON d.id = p.destination_id GROUP BY pack_id ORDER BY most DESC LIMIT 1";
    const [datas] = await Query.find(query);
    res.status(200).json({datas});
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
const getHebergementById = async (req, res) => {
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
// le pack "Best Promo" (celui avec la plus grande réduction) :
const getBestPromoPack = async (req, res) => {
    const query = "SELECT d.*, p.id AS pack_id FROM packs AS p JOIN destinations AS d ON d.id = p.destination_id WHERE p.discount = (SELECT MAX(discount) FROM packs ORDER BY price_adults LIMIT 1)";
    const [datas] = await Query.find(query);
    console.log(datas);
    res.status(200).json({datas});
}
// chercher une activité par ID de destination :
const getActivitiesByDestination = async (req, res) => {
    const query = "SELECT * FROM activities AS a JOIN destinations_activities AS da ON a.id = da.activity_id WHERE da.destination_id = ?";
    const [datas] = await Query.findByValue(query, req.params.id);
    res.status(200).json({ msg: "activités trouvées", datas })
}

export { 
    getAllContinentsAndDestinations,
    getAllContinents,
    getAllDestinations,
    getDestinationByName,
    getImagesDestination,
    getImagesLodging,
    getHebergementById,
    getPacksByDestination,
    getActivitiesByDestination,
    getBestPromoPack,
    getTopDestination
};