import styles from '../../../Summary/summary.module.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function UserDashBookingModifiedSummary() {
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const navigate = useNavigate();

    // sélectionner le 1er pack suite à la fetch :
    const id = 0;

    const { destination } = useSelector((state) => state.allTravel);
    const { packs } = useSelector((state) => state.allTravel);
    const { lodging } = useSelector((state) => state.allTravel);
    const { activities } =  useSelector((state) => state.allTravel);
    const { bookingInfo, bookedData } = useSelector((state) => state.booking);

    // uniquement les activités réservées 
    const [onlyBookedAct, setOnlyBookedAct] = useState([]);

    // récupérer les données des activités DEJA réservées (l'ANCIEN ETAT) pour pouvoir les envoyer dans la BDD
    function getOldActivities(){
        const oldArray = [];
        for(let i = 0; i < activities.length; i++){
            console.log("i = "+i);
            const myObject = {
                nb_adults: 0,
                nb_children: 0,
                price_total_act: 0,
                activity_id: 0,
                id: 0
            };

            console.log("bookedData.datasBookAct.length = "+bookedData.datasBookAct.length);
            for(let j = 0; j < bookedData.datasBookAct.length; j++){
                console.log("bookedData.datasBookAct[j].activity_id = "+bookedData.datasBookAct[j].activity_id);
                console.log("activities[0].id = "+activities[i].id);

                if (bookedData.datasBookAct[j].activity_id === activities[i].id) {
                    console.log(bookedData.datasBookAct[j]);
                    myObject.nb_adults = bookedData.datasBookAct[j].nb_adults;
                    myObject.nb_children = bookedData.datasBookAct[j].nb_children;
                    myObject.price_total_act = bookedData.datasBookAct[j].price_total_act;
                    myObject.activity_id = bookedData.datasBookAct[j].activity_id;
                    myObject.id = bookedData.datasBookAct[j].id;
                } 
            }   
            oldArray.push(myObject);
        }
        console.log(oldArray);
        return oldArray;
    }

    // récupérer les données des activités réservées (le NOUVEL ETAT) pour pouvoir les envoyer dans la BDD
    function getNewActivities(){
        const newArray = [];

        for(let i = 0; i < activities.length; i++){
            const myObject = {
                nb_adults: 0,
                nb_children: 0,
                price_total_act: 0,
                activity_id: 0,
                booking_id: 0,
                name: ''
            };
            if (bookingInfo.nb_adults.activities[i] || bookingInfo.nb_children.activities[i]) {
                myObject.nb_adults = bookingInfo.nb_adults.activities[i];
                myObject.nb_children = bookingInfo.nb_children.activities[i];
                myObject.price_total_act = bookingInfo.prices.total_adults[i] + bookingInfo.prices.total_children[i];
                myObject.activity_id = activities[i].id;
                myObject.booking_id = bookedData.datasBook[0].id;
                myObject.name = activities[i].name;
            }

            newArray.push(myObject);
        }

        return newArray;
    }

    // uniquement les activités réservées qu'on va afficher dans la page Sommaire :
    useEffect(() => {
        if (bookedData.datasBook[0]) {
            setOnlyBookedAct(getNewActivities());
        }
    },[bookedData.datasBook[0]])

    // les options pour le méthode du paiement :
    const paymentOptions = [
        { label: 'Virement', value: '1' },
        { label: 'Chèque', value: '2' }
    ];

    const [paymentType, setPaymentType] = useState(paymentOptions[0].value);

    function handlePaymentChange(e) {
        setPaymentType(e.target.value);
    }

    // confirmer les données et faire une réservation :
    async function handleConfirm() {
        const res = await fetch(`${BASE_URL}/api/v.0.1/user/booking/modify`, {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                nb_adults: bookingInfo.nb_adults.pack,
                nb_children: bookingInfo.nb_children.pack,
                price_total_booking: bookingInfo.prices.total_all,
                paymentType,
                bookingID: bookedData.datasBook[0].id,
                newBookedActiv: getNewActivities(),
                oldBookedActiv: getOldActivities()
            })
        });

        const json = await res.json();
        
        if ( res.status === 201) {
            navigate("/confirmation");
        }
    }

    return <main id="summary">
            {(destination && lodging && packs[0] && activities[0] && bookingInfo.nb_adults && bookedData.datasBook[0]) &&
            <section className={styles.summary_section}>
                <h1>Voici le récapitulatif de votre réservation :</h1>

                <article className={styles.summary_ctn}>
                    <h2>Récapitulatif</h2>
                    <p>Nom et pays de la destination : <span>{destination.name}</span>, <span>{destination.country}</span></p>
                    <p>Nom de l'hébergement : <span>{lodging.name}</span></p>
                    <p>Date de départ : <span>{packs[id].departure_date.slice(0, packs[id].departure_date.indexOf('T'))}</span></p>
                    <p>Date de retour : <span>{packs[id].return_date.slice(0, packs[id].return_date.indexOf('T'))}</span></p> 
                    <p>Durée : <span>{packs[id].duration+1}</span> jours / <span>{packs[id].duration}</span> nuits</p>  
                    <p>Nombre d'adultes : <span>{bookingInfo.nb_adults.pack}</span></p>
                    <p>Nombre d'enfants : <span>{bookingInfo.nb_children.pack}</span></p>
                    <p>Prix du pack (sans activités) : <span>{bookingInfo.prices.total_pack}</span> &euro;</p>
                    <p>Activités choisies : </p>
                    {onlyBookedAct.length ?
                    <ul className={styles.summary_activities}>
                    {onlyBookedAct.filter(el => el.nb_adults > 0 || el.nb_children > 0).map((activity, i) => 
                        <li key={i}>
                            <span>{activity.name}</span> pour <span>{activity.nb_adults}</span> adulte(s) et <span>{activity.nb_children}</span> enfant(s) au prix de <span>{activity.price_total_act}</span> &euro;
                        </li>
                    )}
                    </ul> : <span>aucune activité choisie</span>
                    }
                    <p>Prix total des activités : <span>{bookingInfo.prices.total_activities}</span> &euro;</p>
                    <hr/>
                    <p>Prix total de la réservation : <span>{bookingInfo.prices.total_all}</span> &euro;</p>

                    {/* si l'utilisateur n'a pas encore payé : */}
                    {bookedData.datasBook[0].status === "en cours" ? 
                        <p>A PAYER : <span>{bookingInfo.prices.total_all}</span> &euro;</p> : null}

                    {/* si l'utilisateur a déjà payé : */}
                    {bookedData.datasBook[0].status === "validée" && <>
                        <p>Montant déjà payé : <span>{parseFloat(bookedData.datasBook[0].price_total_booking)}</span> &euro; TTC</p> 
                        <p>RESTE A PAYER : <span>{bookingInfo.prices.total_all - bookedData.datasBook[0].price_total_booking}</span> &euro; TTC</p> 
                    </>}
                </article>

                <article className={styles.summary_ctn}>
                    <h2>Paiement</h2>
                    <p className={styles.nota_bene}>NB : Cher client, après la confirmation de réservation de votre part, vous recevrez un mail confirmation de reception de la réservation. Vous disposerez de 24 heures pour effectuer le paiement ou votre réservation sera annulée.</p>
                    <label>
                        Comment souhaitez-vous effectuer le paiement ?
                        <select value={paymentType} onChange={handlePaymentChange}>
                            {paymentOptions.map((option) => (
                                <option value={option.value} key={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </label>
                </article>

                <button onClick={handleConfirm} className={styles.summary_confirm_btn}>confirmer la réservation</button>
            </section>}
        </main>
}

export default UserDashBookingModifiedSummary;