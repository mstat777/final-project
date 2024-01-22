import styles from './Contact.module.scss';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { validateInput } from '../../Functions/sanitize';
import MainBtn from '../../Containers/buttons/MainBtn/Index';

function Contact(){
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userMessage, setUserMessage] = useState('');

    const [okMsg, setOkMsg] = useState('');
    const [errMsg, setErrMsg] = useState('');

    // pour ne pas soumettre le formulaire, si les inputs ne sont pas valids:
    const [isFormValidated, setIsFormValidated] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // vérifier si tous les champs sont valides :
    const checkFormValidation = () => {
        const nameVerif = validateInput("userName", userName.trim());
        const emailVerif = validateInput("email", userEmail.trim());
        // afficher tous les messages d'erreur :
        setErrMsg(nameVerif.msg + emailVerif.msg);
        // form valide si tous les champs validés :
        (nameVerif.isValid && emailVerif) ? setIsFormValidated(true) : setIsFormValidated(false);
    }

    useEffect(() => {
        if (isFormValidated === true) {
            submitForm();
        }
    },[isFormValidated]);

    async function submitForm() {
        const res = await fetch(`${BASE_URL}/api/v.0.1/contact/sendmail`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                userName,
                userEmail,
                userMessage})
        });
        const json = await res.json();
        
        if (res.status === 201) {
            setOkMsg("Merci de nous avoir contacté.\nVotre message a bien été transmis à notre équipe.");
        } else {
            setErrMsg("Le message n'a pas été envoyé.");
            console.log(res.status);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        checkFormValidation();
    }

    function handleOnFocus(){
        setOkMsg('');
        setErrMsg('');
    }

    return <main id="contact">
            <section className={styles.contact_section}>
                <h1>Page Contact</h1>
                <article>
                    <h2>infos et réservations</h2>
                    <p href="tel:+33123456789" className={styles.text_tel}><FontAwesomeIcon icon={faPhone} className={styles.phone_icon}/>01 23 45 67 89*</p>
                    <p className={styles.no_margin}><small>Prix d'un appel local</small></p>
                    <p>Du lundi au vendredi de 9h à 19h, le samedi de 10h à 18h.</p>
                </article>

                <article>
                    <h2>nous contacter</h2>
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
                                required />
                        </label>

                        <div>
                            <div>
                                <MainBtn type="submit" text="envoyer"/>
                            </div>
                        </div>
                    </form>

                    { (okMsg && userName && userEmail && userMessage) ? 
                        <p className={styles.ok_msg}>{okMsg}</p> : null }
                    { (errMsg && userName && userEmail && userMessage) ? 
                        <p className={styles.err_msg}>{errMsg}</p> : null }

                </article>
                
            </section>
        </main>
}

export default Contact;