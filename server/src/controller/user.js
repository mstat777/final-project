import Query from "../model/Query.js";
import { hash, compare } from "bcrypt";
import jsonwebtoken from "jsonwebtoken";

const { sign } = jsonwebtoken;
const { SK } = process.env;
const SALT = 10;

// vérifier le token
const checkToken = async (req, res) => {
    try {
        const queryUser = "SELECT email, account_type, id FROM users WHERE email = ? AND account_type = ?";
        const [user] = await Query.queryByObject(queryUser, req.params);
        res.status(200).json({ 
            msg: "authentifié", 
            email: user[0].email, 
            userID: user[0].id,
            accountType: user[0].account_type});
    } catch(err) {
        throw Error(err);
    }
};

// connecter l'utilisateur :
const userSignIn = async (req, res) => {
    try {
        let msg = "";
        const queryUser = "SELECT id, email, account_type, password FROM users WHERE email = ?";
        //console.log("req.body.email = " + req.body.email);
        const [user] = await Query.queryByValue(queryUser, req.body.email);
        //si l'utilisateur est trouvé dans la BDD :
        if (user.length) {
            const same = await compare(req.body.password, user[0].password);

            if (same) {
                console.log("utilisateur trouvé. mdp OK.");
                //console.log(`server: ${msg}`);
                const TOKEN = sign({email: user[0].email, accountType: user[0].account_type}, SK);
                res.status(200).json({ 
                    TOKEN, 
                    email: user[0].email, 
                    userID: user[0].id, 
                    accountType: user[0].account_type });
            } else {
                msg = "Mot de passe erroné. Contactez l'administrateur.";
                res.status(409).json({ msg });
            }
        } else if (!user.length){
            msg = "Mauvais identifiant";
            res.status(409).json({ msg });
        }
    } catch (err) {
        throw Error(err);
    }
}

// créer un compte utilisateur de type "client" :
const createUserAccount = async (req, res) => {
    try {
        let msg = "";
        const queryCheckUser = "SELECT email FROM users WHERE email = ?";
        const [user] = await Query.queryByValue(queryCheckUser, req.body.email);

        if (user.length) {
            msg = "Un utilisateur avec cette adresse mail existe déjà !";
            res.status(409).json({ msg });
        } else if (!user.length){
            const datas = {
                lastName: req.body.lastName,
                firstName: req.body.firstName,
                email: req.body.email,
                tel: req.body.tel,
                address: req.body.address,
                birthDate: req.body.birthDate,
                occupation: req.body.occupation,
                password: await hash(req.body.password, SALT)
            };
            const queryWriteUser = "INSERT INTO users (last_name, first_name, email, tel, address, birth_date, occupation, account_type, account_created_by, date_created, password) VALUES (?, ?, ?, ?, ?, ?, ?, 'client', 'client', CURRENT_TIMESTAMP(), ?)";
            await Query.queryByObject(queryWriteUser, datas);

            // souscrire dans le Newsletter :
            if (req.body.checkBoxNewsL) {
                console.log("req.body.email = "+req.body.email);
                const queryNewsL = "INSERT INTO newsletter (email) VALUES (?)";
                await Query.queryByValue(queryNewsL, req.body.email);
            }

            msg = "utilisateur créé";
            res.status(201).json({ msg });
        }
    } catch (err) {
        throw Error(err)
    }
}

// modifier les infos persos de l'utilisateur :
const modifyUserInfo = async (req, res) => {
    try {
        let msg = "";
        const bodyData = [
            req.body.lastName,
            req.body.firstName,
            req.body.tel,
            req.body.address,
            req.body.birthDate,
            req.body.occupation,
            req.body.email
        ]
        const queryUser = "UPDATE users SET last_name = ?, first_name = ?, tel = ?, address = ?, birth_date = ?, occupation = ? WHERE email = ?";
        await Query.queryByArray(queryUser, bodyData);

        msg = "utilisateur créé";
        res.status(201).json({ msg });
    } catch (err) {
        throw Error(err)
    }
}

// trouver les données de l'utilisateur par son ID :
const getUserById = async (req, res) => {
    try {
        const query = "SELECT * FROM users WHERE id = ?";
        const [datas] = await Query.queryByValue(query, req.params.id);
        res.status(200).json({datas});
    } catch (err) {
        throw Error(err)
    }
}

export { checkToken, 
        createUserAccount, 
        userSignIn,
        modifyUserInfo,
        getUserById
}