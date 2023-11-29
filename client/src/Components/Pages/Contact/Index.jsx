import styles from './contact.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';

function Contact(){

    return (
        <main id="contact">
            <div className={styles.contact_section}>
                <p><b>INFOS ET RÉSERVATIONS</b></p>
                <p className={styles.text_tel}><FontAwesomeIcon icon={faPhone} className={styles.phone_icon}/>01 23 45 67 89*</p>
                <p className={styles.text_small}>Prix d'un appel local</p>
                <p>Du lundi au vendredi de 9h à 19h, le samedi de 10h à 18h.</p>
            </div>
        </main>
    )
}

export default Contact;