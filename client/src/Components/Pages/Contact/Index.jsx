import styles from './contact.module.css';

function Contact(){

    return (
        <main id="contact">
            <div className={styles.contact_section}>
                <p>INFOS ET RÉSERVATIONS</p>
                <p>01 23 45 67 89</p>
                <p>(Prix d'un appel local)</p>
                <p>Du lundi au vendredi de 9h à 19h, le samedi de 10h à 18h.</p>
            </div>
        </main>
    )
}

export default Contact;