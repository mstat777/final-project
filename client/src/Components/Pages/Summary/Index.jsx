import styles from './summary.module.css';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useMediaQuery } from "react-responsive";

function Summary(){
    const BASE_URL = process.env.REACT_APP_BASE_URL;
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
    const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
    const isTabletOrDesktop = useMediaQuery({ query: '(min-width: 768px)' });
    useEffect(() => {
        if (isMobile) { window.scrollTo(0, 160); }
        if (isTabletOrDesktop) { window.scrollTo(0, 0); }
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
        //console.log(myArray);
        const filtered = myArray.filter(el => el.nb_adults > 0 || el.nb_children > 0);
        console.log(filtered);
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
        console.log(activitiesForDB);

        const res = await fetch(`${BASE_URL}/api/v.0.1/user/booking/create`, {
            method: "post",
            headers: { "Content-Type": "application/json" },
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

    return (
        <main id="summary">
            
            <div className={styles.summary_section}>

                <h3>Voici le récapitulatif de votre réservation :</h3>
                <div className={styles.summary_ctn}>
                    <p>Nom et pays de la destination : <span>{destination.name}</span>, <span>{destination.country}</span></p>
                    <p>Nom de l'hébergement : <span>{lodging.name}</span></p>
                    <p>Date de départ : <span>{packs[id].departure_date.slice(0, packs[id].departure_date.indexOf('T'))}</span></p>
                    <p>Date de retour : <span>{packs[id].return_date.slice(0, packs[id].return_date.indexOf('T'))}</span></p> 
                    <p>Durée : <span>{packs[id].duration+1}</span> jours / <span>{packs[id].duration}</span> nuits</p>  
                    <p>Nombre d'adultes : <span>{bookingInfo.nb_adults.pack}</span></p>
                    <p>Nombre d'enfants : <span>{bookingInfo.nb_children.pack}</span></p>
                    <p>Prix du pack (sans activités) : <span>{bookingInfo.prices.total_pack}</span> &euro;</p>
                    <p>Activités choisies : </p>
                    {bookedActivities.length ?
                    <ul className={styles.summary_activities}>
                    {bookedActivities.map((activity, index) => 
                        <li key={index}><span>{activity.name}</span> pour <span>{activity.nb_adults}</span> adulte(s) et <span>{activity.nb_children}</span> enfant(s) au prix de <span>{activity.price_total_act}</span> &euro;</li>
                    )}
                    </ul> : <span>aucune activité choisie</span>
                    }
                    <p>Prix total des activités : <span>{bookingInfo.prices.total_activities}</span> &euro;</p>
                    <hr/>
                    <p>Prix total de la réservation : <span>{bookingInfo.prices.total_all}</span> &euro;</p>

                    <p className={styles.nota_bene}>NB : Cher client, après la confirmation de réservation de votre part, vous recevrez un mail confirmation de reception de la réservation. Vous disposerez de 24 heures pour effectuer le paiement ou votre réservation sera annulée.</p>
                    <label>
                        Comment souhaitez-vous effectuer le paiement ?
                        <select value={paymentType} onChange={handlePaymentChange}>
                            {paymentOptions.map((option) => (
                                <option value={option.value} key={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </label>

                </div>

                <button onClick={handleConfirm} className={styles.summary_confirm_btn}>confirmer la réservation</button>
            </div>
            
        </main>
    )
}

export default Summary;