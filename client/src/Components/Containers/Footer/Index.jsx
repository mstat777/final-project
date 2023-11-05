import { NavLink, Link } from 'react-router-dom';
import styles from './footer.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';

function Footer() {
    return (
        <footer className={styles.footer}>
            <section className={styles.footer_social}>
                <Link to={'#'}><FontAwesomeIcon icon={faFacebook} /></Link>
                <Link to={'#'}><FontAwesomeIcon icon={faTwitter} /></Link>
                <Link to={'#'}><FontAwesomeIcon icon={faInstagram} /></Link>
                <Link to={'#'}><FontAwesomeIcon icon={faYoutube} /></Link>
            </section>
            <section className={styles.footer_links}>
                <div>
                    <Link to={'#'}>A propos</Link>
                    <Link to={'#'}>Recrutement</Link>
                </div>
                <div>
                    <Link to={'#'}>Conditions Particulières de Vente</Link>
                    <Link to={'#'}>Mentions légales</Link>
                    <Link to={'#'}>Politique de confidentialité</Link>
                    <Link to={'#'}>Avant de partir</Link>
                    <Link to={'#'}>Info Covid</Link>
                </div>
            </section>
            <section className={styles.footer_legal}>
                <p>&copy;2023 D.Statev tous droits réservés</p>
            </section>
        </footer>
    )
}

export default Footer;