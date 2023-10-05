import Query from "../model/Query.js";
import { hash } from "bcrypt";
// JWT allows to authenticate users in a stateless manner, without actually storing any information about them on the system itself
import jsonwebtoken from "jsonwebtoken";

const { sign } = jsonwebtoken;
const { SK } = process.env;
const SALT = 10;

const checkToken = async (req, res) => {
    try {
        const queryUser = "SELECT mail FROM utilisateur WHERE mail = ?";
        await Query.findByValue(queryUser, req.params.mail);
        res.status(200).json({ msg: "authentifié", id: queryUser.mail })
    } catch(err) {
        throw Error(err);
    }
};

const signIn = async (req, res) => {
    try {
        let msg = "";
        const datas = {
            mail: req.body.mail
        };
        const queryUser = "SELECT * FROM utilisateurs WHERE mail = ?";
        const [user] = await Query.findByDatas(queryUser, datas);

        if (user.length) {
            msg = "utilisateur trouvé";
            const TOKEN = sign({ mail: user[0].mail}, SK);
        } else if (!user.length){
            msg = "mauvais identifiant";
            req.status(409).json({ msg });
        }
    } catch (err) {
        throw Error(err);
    }
}


const createAccount = async (req, res) => {
    try {
        let msg = "";
        const datas = {
            mail: req.body.mail
        };
        const queryUser = "SELECT mail FROM utilisateurs WHERE mail = ?";
        const [user] = await Query.findByValue(queryUser, datas);

        if (user.length) {
            msg = "un utilisateur avec cette adresse mail existe déjà";
            req.status(409).json({ msg });
        } else if (!user.length){
            const datas = {
                lastName: req.body.lastName,
                firstName: req.body.firstName,
                mail: req.body.mail,
                password: await hash(req.body.password, SALT)
            };
            const query = "INSERT INTO utilisateurs (nom, prenom, mail, tel, ne_jour, ne_mois, ne_annee, situation, date_cree, abonnamment, mdp) VALUES (?, ?, ?, 0123, 3, 4, 1985, 'manager', NOW(), 'BASIC', ?)";
            await Query.write(query, datas);

            msg = "utilisateur créé";
            res.status(201).json({ msg });
        }
    } catch (err) {
        throw Error(err)
    }
}

export { checkToken, createAccount, signIn };