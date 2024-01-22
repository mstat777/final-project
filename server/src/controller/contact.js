import Query from "../model/Query.js";
import nodemailer from 'nodemailer';

const sendMail = async (req, res) => {
    try {
        console.log(req.body);
        var name = req.body.userName;
        var email = req.body.userEmail;
        var message = req.body.userMessage;
        var content = `name: ${name} \n email: ${email} \n message: ${message} `;
        console.log(content);
        var mail = {
            from: name,
            to: process.env.MAIL_USER,
            subject: 'New Message from Contact Form',
            text: content
        }
        console.log(mail);
        const transport = {
            host: 'smtp.hostinger.com',
            port: 587,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PWD
            }
        }
        const transporter = nodemailer.createTransport(transport);
        
        transporter.sendMail(mail, (err, data) => {
            if (err) {
                res.status(400).json({msg: 'fail'});
            } else {
                res.status(201).json({msg: 'success'});
            }
        });
        transporter.verify((error, success) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Server is ready to take messages');
            }
        });
    } catch (err) {
        throw Error(err);
    }
}

const subscribeNewsletter = async (req, res) => {
    try {
        let msg = "";
        const queryUser = "SELECT email FROM newsletter WHERE email = ?";
        const [user] = await Query.queryByValue(queryUser, req.body.userEmail);

        if (user.length) {
            msg = "Vous êtes déjà inscrit !";
            res.status(409).json({ msg });
        } else if (!user.length) {
            const query = "INSERT INTO newsletter (email) VALUES (?)";
            await Query.queryByObject(query, req.body);
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
}