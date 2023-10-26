import styles from './summary.module.css';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

function Summary(){
    const dispatch = useDispatch();
    let { id } = useParams();

    const { destination } = useSelector((state) => state.allTravel);

    const { packs } = useSelector((state) => state.allTravel);
    const { hebergement } = useSelector((state) => state.allTravel);
    const { activites } =  useSelector((state) => state.allTravel);

    async function handleClick() {

    }

    return (
        <main id="summary">

            <div className={styles.summary_section}>

                <p>Voici le récapitulatif de votre réservation :</p>
                <div className={styles.summary_ctn}>
                    <p>Nom et pays de la destination : <span>{destination.nom}</span>, <span>{destination.continent}</span></p>
                    <p>Nom de l'hébérgement : <span>{hebergement.nom}</span></p>
                    <p>Date de départ :<span>{packs[id].date_depart.slice(0, packs[id].date_retour.indexOf('T'))}</span></p>
                    <p>Date de retour :<span>{packs[id].date_retour.slice(0, packs[id].date_retour.indexOf('T'))}</span></p> 
                    <p>Durée :<span>{packs[id].duree+1}</span> jours / <span>{packs[id].duree}</span> nuits</p>  
                    <p>Nombre d'adultes :</p>
                    <p>Nombre d'enfants :</p>
                    <p>Prix/TTC/adulte :<span>{packs[id].prix_adulte}</span> &euro;</p> 
                    <p>Prix/TTC/enfant :<span>{packs[id].prix_enfant}</span> &euro;</p> 
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