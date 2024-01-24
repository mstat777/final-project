import styles from './Agency.module.scss';
import agency_photo from '../../../assets/img/agency-pexels-cadomaestro-1170412.jpg';

import { useEffect } from "react";

function Agency(){

    useEffect(() => {
        window.scrollTo(0, 0);
    },[]);

    return <main id="agency">
                <section className={styles.agency_section}>

                    <img src={agency_photo} alt="le bureau de l'agence Dimitravel"/>

                    <article>
                        <h1>Notre agence</h1>
                        <p>L’agence Dimitravel a été créée en 2018 par M. STEVEN Dimitri. Elle est spécialisée dans les voyages organisés de type « séjour ». Aujourd’hui l’agence propose plus de 300 destinations en France et dans le monde.</p>
                        <p>En pleine croissance, l’agence Dimitravel compte bien poursuivre son évolution. Elle prévoit ainsi d’agrandir son équipe et envisage de créer de nouvelles antennes, en France et en Belgique.</p>
                    </article>
                    
                </section>
            </main>
}

export default Agency;