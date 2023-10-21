import Query from "../model/Query.js";

const getAllDestinations = async (req, res) => {
    const query = "SELECT nom FROM destinations GROUP BY nom";
    const [data] = await Query.find(query);
    res.status(200).json({data});
}

const getLastOffer = async (req, res) => {
    const query = "SELECT reference, nom, destination, type FROM offres ORDER BY id LIMIT 1";
    const [datas] = await Query.find(query);
}

export { 
    getAllDestinations,
    getLastOffer 
};