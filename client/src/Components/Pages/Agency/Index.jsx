import styles from './agency.module.css';
import agency_photo from '../../../assets/img/agency-pexels-cadomaestro-1170412.jpg';

import { useEffect } from "react";

function Agency(){

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <main id="agency">
            <div className={styles.agency_section}>
                <img src={agency_photo} alt="photo de l'agence" />
                <h2>Notre agence</h2>
                <p>L’agence Dimitravel a été créée en 2018 par M. STEVEN Dimitri. Elle est spécialisée dans les voyages organisés de type « séjour ». Aujourd’hui l’agence propose plus de 300 destinations en France et dans le monde.</p>
                <p>En pleine croissance, l’agence Dimitravel compte bien poursuivre son évolution. Elle prévoit ainsi d’agrandir son équipe et envisage de créer de nouvelles antennes, en France et en Belgique.</p>
            </div>
        </main>
    )
}

export default Agency;