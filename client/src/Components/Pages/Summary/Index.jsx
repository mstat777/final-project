import styles from './summary.module.css';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

function Summary(){
    const dispatch = useDispatch();
    let { id } = useParams();

    const { destination } = useSelector((state) => state.allTravel);

    const { packs } = useSelector((state) => state.allTravel);
    const { lodging } = useSelector((state) => state.allTravel);
    const { activities } =  useSelector((state) => state.allTravel);

    async function handleClick() {

    }

    return (
        <main id="summary">

            <div className={styles.summary_section}>

                <p>Voici le récapitulatif de votre réservation :</p>
                <div className={styles.summary_ctn}>
                    <p>Nom et pays de la destination : <span>{destination.name}</span>, <span>{destination.continent}</span></p>
                    <p>Nom de l'hébérgement : <span>{lodging.name}</span></p>
                    <p>Date de départ :<span>{packs[id].departure_date.slice(0, packs[id].departure_date.indexOf('T'))}</span></p>
                    <p>Date de retour :<span>{packs[id].return_date.slice(0, packs[id].return_date.indexOf('T'))}</span></p> 
                    <p>Durée :<span>{packs[id].duration+1}</span> jours / <span>{packs[id].duration}</span> nuits</p>  
                    <p>Nombre d'adultes :</p>
                    <p>Nombre d'enfants :</p>
                    <p>Prix/TTC/adulte :<span>{packs[id].price_adults}</span> &euro;</p> 
                    <p>Prix/TTC/enfant :<span>{packs[id].price_children}</span> &euro;</p> 
                    <p>Prix de la réservation (sans activités) :</p>
                    <p>Activités choisies :</p>

                    <p>Prix total de la réservation :</p>
                </div>

                <button onClick={handleClick} className={styles.confirm_btn}>confirmer la réservation</button>
            </div>

        </main>
    )
}

export default Summary;