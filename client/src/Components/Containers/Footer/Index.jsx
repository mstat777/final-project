import styles from './Footer.module.scss';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import MainBtn from '../buttons/MainBtn/Index';
import { validateInput } from '../../Functions/sanitize';

function Footer() {
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const [userEmail, setUserEmail] = useState('');
    const [okMsg, setOkMsg] = useState('');
    const [errMsg, setErrMsg] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();

        const emailVerif = validateInput("userEmail", userEmail.trim());
        setErrMsg(emailVerif.msg);

        if (emailVerif.isValid) {
            const res = await fetch(`${BASE_URL}/api/v.0.1/contact/newsletter`, {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userEmail })
            });
            const json = await res.json();
            if (res.status === 201) {
                setOkMsg("Merci pour votre souscription.");
                setUserEmail('');
            } else if (res.status === 409) {
                setErrMsg(json.msg);
                setUserEmail('');
            }
        }
    }

    return <footer className={styles.footer}>
            <section className={styles.footer_links}>

                <div>
                    <h2 className={styles.footer_title}>suivez-nous</h2>
                    <ul className={styles.footer_social}>
                        <li><Link to={'#'}><FontAwesomeIcon icon={faFacebook} /></Link></li>
                        <li><Link to={'#'}><FontAwesomeIcon icon={faTwitter} /></Link></li>
                        <li><Link to={'#'}><FontAwesomeIcon icon={faInstagram} /></Link></li>
                        <li><Link to={'#'}><FontAwesomeIcon icon={faYoutube} /></Link></li>
                    </ul>

                    <h2 className={styles.footer_title}>A propos</h2>
                    <ul>
                        <li><Link to={'#'}>A propos</Link></li>
                        <li><Link to={'#'}>Recrutement</Link></li>
                    </ul>
                </div>

                <div>
                    <h2 className={styles.footer_title}>informations pratiques</h2>
                    <ul>
                        <li><Link to={'#'}>Conditions Particulières de Vente</Link></li>
                        <li><Link to={'#'}>Mentions légales</Link></li>
                        <li><Link to={'#'}>Politique de confidentialité</Link></li>
                        <li><Link to={'#'}>Avant de partir</Link></li>
                        <li><Link to={'#'}>Info Covid</Link></li>
                    </ul>
                </div>

                <div>
                    <h2>inscription newsletter</h2>
                    <p>J'accepte de recevoir les offres commerciales et newsletters de Dimitravel</p>

                    <form onSubmit={handleSubmit} className={styles.newsletter_form}>
                        <input type="email" 
                            name="userEmail" 
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            onFocus={() => {
                                setOkMsg('');
                                setErrMsg('');}}
                            placeholder="Email"
                            required/>
                        <MainBtn type="submit" text="OK"/>
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
}

export default Footer;