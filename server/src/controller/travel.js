import Query from "../model/Query.js";

const getAllDestinations = async (req, res) => {
    const query = "SELECT nom FROM destinations GROUP BY nom";
    const [datas] = await Query.find(query);
    res.status(200).json({datas});
}

const getDestinationByName = async (req, res) => {
    const query = "SELECT id, reference, nom, pays, continent, description, lieu_depart, url_image_initiale, hebergement_id FROM destinations WHERE nom = ?";
    const [datas] = await Query.findByValue(query, req.params.name);
    res.status(200).json({ msg: "destination trouvée", datas })
}

const getHebergementById = async (req, res) => {
    const query = "SELECT * FROM hebergements WHERE id = ?";
    const [datas] = await Query.findByValue(query, req.params.id);
    res.status(200).json({ msg: "hébérgement trouvé", datas })
}

const getPacksByDestination = async (req, res) => {
    const query = "SELECT * FROM packs WHERE destination_id = ?";
    const [datas] = await Query.findByValue(query, req.params.id);
    res.status(200).json({ msg: "packs trouvés", datas })
}

export { 
    getAllDestinations,
    getDestinationByName,
    getHebergementById,
    getPacksByDestination
};