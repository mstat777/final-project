import Query from "../model/Query.js";

const getAllDestinations = async (req, res) => {
    const query = "SELECT name FROM destinations GROUP BY name";
    const [datas] = await Query.find(query);
    res.status(200).json({datas});
}

const getDestinationByName = async (req, res) => {
    const query = "SELECT id, reference, name, country, continent, overview, departure_place, url_initial_image, lodging_id FROM destinations WHERE name = ?";
    const [datas] = await Query.findByValue(query, req.params.name);
    res.status(200).json({ msg: "destination trouvée", datas })
}

const getImagesDestination = async (req, res) => {
    const query = "SELECT id, name, url_image FROM destinations_images WHERE destination_id = ?";
    const [datas] = await Query.findByValue(query, req.params.id);
    res.status(200).json({ msg: "images trouvées", datas })
}

const getHebergementById = async (req, res) => {
    const query = "SELECT * FROM lodgings WHERE id = ?";
    const [datas] = await Query.findByValue(query, req.params.id);
    res.status(200).json({ msg: "hébérgement trouvé", datas })
}

const getPacksByDestination = async (req, res) => {
    const query = "SELECT * FROM packs WHERE destination_id = ?";
    const [datas] = await Query.findByValue(query, req.params.id);
    res.status(200).json({ msg: "packs trouvés", datas })
}

const getActivitiesByDestination = async (req, res) => {
    const query = "SELECT * FROM activities AS a JOIN destinations_activities AS da ON a.id = da.activity_id WHERE da.destination_id = ?";
    const [datas] = await Query.findByValue(query, req.params.id);
    res.status(200).json({ msg: "activités trouvées", datas })
}

export { 
    getAllDestinations,
    getDestinationByName,
    getImagesDestination,
    getHebergementById,
    getPacksByDestination,
    getActivitiesByDestination
};