import Query from "../model/Query.js";

const getLastOffer = async (req, res) => {
    const query = "SELECT reference, nom, destination, type FROM offres ORDER BY id LIMIT 1";
    const [datas] = await Query.find(query);
}

export { getLastOffer };