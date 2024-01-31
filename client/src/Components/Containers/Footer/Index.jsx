import styles from './Footer.module.scss';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import MainBtn from '../buttons/MainBtn/Index';
import { validateInput } from '../../Functions/validate.js';
import visa from '../../../assets/img/visa.png';
import masterCard from '../../../assets/img/mastercard.png';
import americanExpress from '../../../assets/img/americanexpress.png';
import discover from '../../../assets/img/discover.png';

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
                        <li><a href="https://www.facebook.com/BeautifulDestinations/" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faFacebook} /></a></li>
                        <li><a href="https://twitter.com/beadestinations?lang=fr" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faTwitter} /></a></li>
                        <li><a href="https://www.instagram.com/beautifuldestinations/" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faInstagram} /></a></li>
                        <li><a href="https://www.youtube.com/watch?v=RgCENw09Dpk" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faYoutube}/></a></li>
                    </ul>

                    <h2 className={styles.footer_title}>A propos</h2>
                    <ul>
                        <li><Link to={"/agency"}>A propos</Link></li>
                        <li><Link to={"/general/recruitment"}>Recrutement</Link></li>
                    </ul>
                </div>

                <div>
                    <h2 className={styles.footer_title}>informations pratiques</h2>
                    <ul>
                        <li><Link to={"/general/terms-of-use"}>Conditions Particulières de Vente</Link></li>
                        <li><Link to={"/general/terms-of-use"}>Mentions légales</Link></li>
                        <li><Link to={"/general/terms-of-use"}>Politique de confidentialité</Link></li>
                        <li><Link to={"/general/terms-of-use"}>Avant de partir</Link></li>
                        <li><Link to={"/general/info-covid"}>Info Covid</Link></li>
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

                    <h2>paiement sécurisé</h2>
                    <div className={styles.payment_methods}>
                        <img src={visa} alt="carte Visa"/>
                        <img src={masterCard} alt="carte MasterCard"/>
                        <img src={americanExpress} alt="carte American Express"/>
                        <img src={discover} alt="carte Discover"/>
                    </div>
                </div>
            </section>

            <section className={styles.footer_legal}>
                <p>&copy;2023 DS</p>
            </section>

        </footer>
}

export default Footer;