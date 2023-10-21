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

const userSignIn = async (req, res) => {
    try {
        let msg = "";
        const queryUser = "SELECT * FROM utilisateurs WHERE mail = ?";
        console.log("req.body.email" + req.body.email);
        const [user] = await Query.findByValue(queryUser, req.body.email);
        console.log("user.mail = "+user[0].mail);
        if (user.length) {
            msg = "utilisateur trouvé";
            console.log("server - utilisateur trouvé");
            const TOKEN = sign({ mail: user[0].mail}, SK);
            res.status(200).json({ msg, TOKEN });
        } else if (!user.length){
            msg = "mauvais identifiant";
            res.status(409).json({ msg });
        }
    } catch (err) {
        throw Error(err);
    }
}

const createUserAccount = async (req, res) => {
    try {
        let msg = "";
        const datas = {
            mail: req.body.email
        };
        const queryUser = "SELECT mail FROM utilisateurs WHERE mail = ?";
        const [user] = await Query.findByValue(queryUser, datas);

        if (user.length) {
            msg = "un utilisateur avec cette adresse mail existe déjà";
            res.status(409).json({ msg });

        } else if (!user.length){
            const datas = {
                lastName: req.body.lastName,
                firstName: req.body.firstName,
                email: req.body.email,
                tel: req.body.tel,
                addresse: req.body.addresse,
                birthday: req.body.birthday,
                profession: req.body.profession,
                password: await hash(req.body.password, SALT)
            };
            const query = "INSERT INTO utilisateurs (nom, prenom, mail, tel, adresse, date_naissance, profession, type_compte, compte_cree_par, date_creation, mdp) VALUES (?, ?, ?, ?, ?, ?, ?, 'client', 'client', CURRENT_TIMESTAMP(), ?)";
            await Query.write(query, datas);

            msg = "utilisateur créé";
            res.status(201).json({ msg });
        }
    } catch (err) {
        throw Error(err)
    }
}

export { checkToken, 
        createUserAccount, 
        userSignIn 
};