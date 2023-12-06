import styles from './contact.module.css';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';

import { validateInput } from '../../Functions/sanitize';

function Contact(){
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userMessage, setUserMessage] = useState('');

    const [msg, setMsg] = useState('');

    // pour ne pas soumettre le formulaire, si les inputs ne sont pas valids:
    const [isFormValidated, setIsFormValidated] = useState(false);

    // vérifier si tous les champs sont valides. Si OUI, le form est valide :
    const checkFormValidation = () => {
        // on vérifie les champs :
        const nameVerif = validateInput("userName", userName.trim());
        console.log("nameVerif.isValid = "+nameVerif.isValid);
        // rassembler toutes les messages d'erreur pour les afficher au-dessous du formulaire :
        setMsg(nameVerif.msg);
        // si tous les champs obligatoires sont validés, on valide le formulaire :
        nameVerif.isValid ? setIsFormValidated(true) : setIsFormValidated(false);
        console.log("isFormValidated = "+isFormValidated);
    }

    useEffect(() => {
        if (isFormValidated === true) {
            submitForm();
        }
    },[isFormValidated]);

    async function submitForm() {
        console.log("Contact form sent!");
        /*
        const res = await fetch(`${BASE_URL}/api/v.0.1/contact/message`, {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                userName,
                userEmail,
                userMessage})
        });
        const json = await res.json();
        setMsg(json.msg);
        
        if (res.status === 201) {
            dispatch(setLogMessage("Merci de nous avoir contacté.\nVotre message a bien été transmis à notre équipe."));
        }*/
        setMsg("Merci de nous avoir contacté.\nVotre message a bien été transmis à notre équipe.");
    }

    async function handleSubmit(e) {
        e.preventDefault();
        // vérifier si tous les champs sont valides :
        checkFormValidation();
    }

    function handleOnFocus(){
        setMsg("");
    }

    return (
        <main id="contact">

            <div className={styles.contact_section}>
                <div>
                    <p className={styles.title}>infos et réservations</p>
                    <p className={styles.text_tel}><FontAwesomeIcon icon={faPhone} className={styles.phone_icon}/>01 23 45 67 89*</p>
                    <p className={styles.text_small}>Prix d'un appel local</p>
                    <p>Du lundi au vendredi de 9h à 19h, le samedi de 10h à 18h.</p>
                </div>

                <div>
                    <p className={styles.title}>nous contacter</p>
                    <form onSubmit={handleSubmit} className={styles.contact_form}>
                        <label>  
                            <span>Nom :</span>
                            <input type="text" 
                                name="userName" 
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                onFocus={handleOnFocus}
                                required/> 
                        </label>

                        <label>  
                            <span>Mail :</span>
                            <input type="email" 
                                name="userEmail" 
                                value={userEmail}
                                onChange={(e) => setUserEmail(e.target.value)}
                                onFocus={handleOnFocus}
                                required/> 
                        </label>

                        <label>  
                            <span>Message :</span>
                            <textarea name="userMessage"
                                value={userMessage}
                                onChange={(e) => setUserMessage(e.target.value)}
                                onFocus={handleOnFocus}
                                placeholder="(max 600 caractères)"
                                rows="7"
                                maxLength="600"
                                required></textarea>
                        </label>

                        <div>
                            <div>
                                <button type="submit">envoyer</button>
                            </div>
                        </div>
                    </form>

                    { (msg && userName && userEmail && userMessage) && 
                        <p className={styles.msg}>{msg}</p> }

                </div>
                
            </div>
        </main>
    )
}

export default Contact;