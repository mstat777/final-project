import styles from './Summary.module.scss';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { formatDate } from '../../Functions/utils';
import MainBtn from '../../Containers/buttons/MainBtn/Index';

function Summary(){
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const TOKEN = localStorage.getItem("auth");
    const navigate = useNavigate();

    let { id } = useParams();

    const { destination } = useSelector((state) => state.allTravel);
    const { packs } = useSelector((state) => state.allTravel);
    const { lodging } = useSelector((state) => state.allTravel);
    const { activities } =  useSelector((state) => state.allTravel);
    const { bookingInfo } = useSelector((state) => state.booking);
    const { userInfo } =  useSelector((state) => state.user);

    const [bookedActivities, setBookedActivities] = useState([]);

    // remonter au top de la page lors de chargement
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    // récupérer les données uniquement des activités réservées pour pouvoir les envoyer dans la BDD
    function findBookedActivities(){
        const myArray = [];
        for(let i = 0; i < activities.length; i++){
            const myObject = {};
            myObject.name = activities[i].name;
            myObject.nb_adults = bookingInfo.nb_adults.activities[i];
            myObject.nb_children = bookingInfo.nb_children.activities[i];
            myObject.price_total_act = bookingInfo.prices.total_adults[i] + bookingInfo.prices.total_children[i];
            myObject.activity_id = activities[i].id;

            myArray.push(myObject);
        }

        const filtered = myArray.filter(el => el.nb_adults > 0 || el.nb_children > 0);
        return filtered;
    }

    // les options pour le méthode du paiement :
    const paymentOptions = [
        { label: 'Virement', value: '1' },
        { label: 'Chèque', value: '2' }
    ];

    const [paymentType, setPaymentType] = useState(paymentOptions[0].value);

    function handlePaymentChange(e) {
        setPaymentType(e.target.value);
    }

    useEffect(() => {
        setBookedActivities(findBookedActivities());
    },[])

    // confirmer les données et faire une réservation :
    async function handleConfirm() {
        // on enregistre les activités sélectionnées pour les passer en tant que Array:
        const activitiesForDB = [];
        bookedActivities.forEach(el => {
            delete el.name;
            activitiesForDB.push(Object.values(el));
        });

        const res = await fetch(`${BASE_URL}/api/v.0.1/booking/create`, {
            method: "post",
            headers: { "Content-Type": "application/json",
                        Authentication: "Bearer " + TOKEN },
            body: JSON.stringify({ 
                nb_adults: bookingInfo.nb_adults.pack,
                nb_children: bookingInfo.nb_children.pack,
                price_total_booking: bookingInfo.prices.total_all,
                paymentType,
                pack_id: packs[id].id, // l'ID du pack stocké dans 'params'
                user_id: userInfo.userID,
                activities: activitiesForDB
            })
        });
        const json = await res.json();
        if ( res.status === 201) {
            navigate("/confirmation");
        }
    }

    return <main id="summary">
            
            <section className={styles.summary_section}>
                <h1>Voici le récapitulatif de votre réservation :</h1>

                <article className={styles.summary_ctn}>
                    <h2>Récapitulatif</h2>
                    <p>Nom et pays de la destination : <b>{destination.name}</b>, <b>{destination.country}</b></p>
                    <p>Nom de l'hébergement : <b>{lodging.name}</b></p>
                    <p>Date de départ : <b>{formatDate(packs[id].departure_date)}</b></p>
                    <p>Date de retour : <b>{formatDate(packs[id].return_date)}</b></p> 
                    <p>Durée : <b>{packs[id].duration+1}</b> jours / <b>{packs[id].duration}</b> nuits</p>  
                    <p>Nombre d'adultes : <b>{bookingInfo.nb_adults.pack}</b></p>
                    <p>Nombre d'enfants : <b>{bookingInfo.nb_children.pack}</b></p>
                    <p>Prix du pack (sans activités) : <b>{bookingInfo.prices.total_pack}</b> &euro;</p>
                    <p>Activités choisies : </p>
                    {bookedActivities.length ?
                        <ul className={styles.summary_activities}>
                        {bookedActivities.map((activity, i) => 
                            <li key={i}>
                                <b>{activity.name}</b> pour <b>{activity.nb_adults}</b> adulte(s) et <b>{activity.nb_children}</b> enfant(s) au prix de <b>{activity.price_total_act}</b> &euro;
                            </li>
                        )}
                        </ul> : <span><b> aucune activité choisie</b></span>
                    }
                    <p>Prix total des activités : <b>{bookingInfo.prices.total_activities}</b> &euro;</p>
                    <hr/>
                    <p>Prix total de la réservation : <b>{bookingInfo.prices.total_all}</b> &euro;</p>
                </article>

                <article className={styles.summary_ctn}>
                    <h2>Paiement</h2>
                    <p className={styles.nota_bene}>NB : Cher client, après la confirmation de réservation de votre part, vous recevrez un mail confirmation de reception de la réservation. Vous disposerez de 24 heures pour effectuer le paiement ou votre réservation sera annulée.</p>
                    <label>
                        <p>Comment souhaitez-vous effectuer le paiement ?</p>
                        <select value={paymentType} onChange={handlePaymentChange}>
                            {paymentOptions.map((option) => (
                                <option value={option.value} key={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </label>
                </article>

                <MainBtn onClick={handleConfirm} className={styles.confirm_btn} text="confirmer la réservation"/>
            </section>     
        </main>
}

export default Summary;