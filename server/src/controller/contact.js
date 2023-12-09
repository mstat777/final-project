import Query from "../model/Query.js";

const sendMail = async (req, res) => {

}

const subscribeNewsletter = async (req, res) => {
    try {
        let msg = "";
        const queryUser = "SELECT email FROM newsletter WHERE email = ?";
        const [user] = await Query.findByValue(queryUser, req.body.userEmail);

        if (user.length) {
            msg = "Vous êtes déjà inscrit !";
            res.status(409).json({ msg });
        } else if (!user.length) {
            const query = "INSERT INTO newsletter (email) VALUES (?)";
            await Query.write(query, req.body);
            let msg = "utilisateur souscrit";
            res.status(201).json({ msg });
        }
    } catch (err) {
        throw Error(err);
    }
}

export { 
    sendMail,
    subscribeNewsletter
};