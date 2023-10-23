import Query from "../model/Query.js";

const getAllDestinations = async (req, res) => {
    const query = "SELECT nom FROM destinations GROUP BY nom";
    const [datas] = await Query.find(query);
    res.status(200).json({datas});
}

const getDestinationByName = async (req, res) => {
    const query = "SELECT * FROM destinations WHERE nom = ?";
    const [datas] = await Query.findByValue(query, req.params.name);
    //console.log("datas = "+datas[0].nom);
    res.status(200).json({ msg: "destination trouvée", datas })
}

export { 
    getAllDestinations,
    getDestinationByName 
};