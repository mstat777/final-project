import styles from './footer.module.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';

function Footer() {
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const [userEmail, setUserEmail] = useState('');
    const [okMsg, setOkMsg] = useState('');
    const [errMsg, setErrMsg] = useState('');

    // pop-up erreur pour le champ maxPrice de la barre de recherche :
    function emailAlertMsg(e){
        /*if (!e.target.value) {
            return e.target.setCustomValidity("Veuillez renseigner votre mail");
        } else if (e.target.value !== '') {
            return e.target.setCustomValidity("Le format de mail n'est pas correct.");
        }*/
        e.target.setCustomValidity("Veuillez renseigner votre mail");
    }

    async function handleSubmit(e) {
        e.preventDefault();
        console.log("Newsletter form sent!");

        const res = await fetch(`${BASE_URL}/api/v.0.1/contact/newsletter`, {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userEmail })
        });
        const json = await res.json();
        console.log(json.msg);
        
        if (res.status === 201) {
            setOkMsg("Merci pour votre souscription.");
            setUserEmail('');
        } else if (res.status === 409) {
            setErrMsg(json.msg);
            setUserEmail('');
        }
    }

    return (
        <footer className={styles.footer}>
            <section className={styles.footer_links}>

                <div>
                    <section className={styles.footer_social}>
                        <p className={styles.footer_title}>suivez-nous</p>
                        <Link to={'#'}><FontAwesomeIcon icon={faFacebook} /></Link>
                        <Link to={'#'}><FontAwesomeIcon icon={faTwitter} /></Link>
                        <Link to={'#'}><FontAwesomeIcon icon={faInstagram} /></Link>
                        <Link to={'#'}><FontAwesomeIcon icon={faYoutube} /></Link>
                    </section>
                    <p className={styles.footer_title}>A propos</p>
                    <Link to={'#'}>A propos</Link>
                    <Link to={'#'}>Recrutement</Link>
                </div>

                <div>
                    <p className={styles.footer_title}>informations pratiques</p>
                    <Link to={'#'}>Conditions Particulières de Vente</Link>
                    <Link to={'#'}>Mentions légales</Link>
                    <Link to={'#'}>Politique de confidentialité</Link>
                    <Link to={'#'}>Avant de partir</Link>
                    <Link to={'#'}>Info Covid</Link>
                </div>

                <div>
                    <p className={styles.footer_title}>inscription newsletter</p>
                    <p>J'accepte de recevoir les offres commerciales et newsletters de Dimitravel</p>

                    <form onSubmit={handleSubmit} className={styles.newsletter_form}>
                        <input type="email" 
                            name="userEmail" 
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            onFocus={() => {
                                setOkMsg('');
                                setErrMsg('');}}
                            onInvalid={emailAlertMsg}
                            onInput={(e) => e.target.setCustomValidity('')}
                            required/>
                        <button type="submit">OK</button>
                    </form>

                    { okMsg && 
                        <p className={styles.ok_msg}>{okMsg}</p>}
                    { errMsg && 
                        <p className={styles.err_msg}>{errMsg}</p>}
                </div>
            </section>

            <section className={styles.footer_legal}>
                <p>&copy;2023 DS</p>
            </section>

        </footer>
    )
}

export default Footer;