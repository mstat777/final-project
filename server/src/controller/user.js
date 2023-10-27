import Query from "../model/Query.js";
import { hash, compare } from "bcrypt";
// JWT allows to authenticate users in a stateless manner, without actually storing any information about them on the system itself
import jsonwebtoken from "jsonwebtoken";

const { sign } = jsonwebtoken;
const { SK } = process.env;
const SALT = 10;

const checkToken = async (req, res) => {
    try {
        const queryUser = "SELECT email FROM user WHERE email = ?";
        await Query.findByValue(queryUser, req.params.email);
        res.status(200).json({ msg: "authentifié", id: queryUser.email })
    } catch(err) {
        throw Error(err);
    }
};

const userSignIn = async (req, res) => {
    try {
        let msg = "";
        const queryUser = "SELECT * FROM users WHERE email = ?";
        console.log("req.body.email = " + req.body.email);
        const [user] = await Query.findByValue(queryUser, req.body.email);
        //console.log("user.email = "+user[0].email);
        if (user.length) {

            const same = await compare(req.body.password, user[0].password);

            if (same) {
                msg = "utilisateur trouvé";
                console.log("server - utilisateur trouvé");
                const TOKEN = sign({ email: user[0].email}, SK);
                res.status(200).json({ msg, TOKEN });
            } else {
                msg = "Mot de passe erroné. Contactez l'administrateur";
                res.status(409).json({ msg });
            }
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
            email: req.body.email
        };
        const queryUser = "SELECT email FROM users WHERE email = ?";
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
                birthDate: req.body.birthDate,
                occupation: req.body.occupation,
                password: await hash(req.body.password, SALT)
            };
            const query = "INSERT INTO users (last_name, first_name, email, tel, addresse, birth_date, occupation, account_type, account_created_by, date_created, password) VALUES (?, ?, ?, ?, ?, ?, ?, 'client', 'client', CURRENT_TIMESTAMP(), ?)";
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