import styles from './Summary.module.scss';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { formatDate } from '../../Functions/utils';
import MainBtn from '../../Containers/buttons/MainBtn/Index';
import { setPackID, setSelectedActivities } from '../../../store/slices/booking';

function Summary(){
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const TOKEN = localStorage.getItem("auth");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    let { id } = useParams(); // à supprimer

    const { destination, packs, lodging, activities } = useSelector((state) => state.allTravel);
    const { bookingInfo } = useSelector((state) => state.booking);
    const { userInfo } =  useSelector((state) => state.user);

    // les activités réservées affichées sur la page
    const [bookedActivities, setBookedActivities] = useState([]);

    const [errMsg, setErrMsg] = useState('');
    const [paymentType, setPaymentType] = useState(0);
    // les options pour le méthode du paiement :
    const paymentOptions = [
        { label: '', value: '0' },
        { label: 'Carte', value: '1' },
        { label: 'Virement', value: '2' },
        { label: 'Chèque', value: '3' }
    ];

    // remonter au top de la page lors de chargement
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // récupérer l'ID du pack pour la réservation
    useEffect(() => {
        if(packs[id].id) {
            dispatch(setPackID(packs[id].id));
        }
    }, [packs[id].id]);

    // récupérer les données uniquement des activités réservées pour pouvoir les envoyer dans la BDD
    useEffect(() => {
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
            setBookedActivities(filtered);
        }
        if(activities[0]) {
            findBookedActivities();
        }
    },[activities[0]]);

    // modifier les activités sélectionnées pour les enregistrer dans la BDD :
    useEffect(() => {
        if (bookedActivities.length) {
            const activitiesForDB = [];
            for (let i = 0; i < bookedActivities.length; i++){
                activitiesForDB.push(Object.values(bookedActivities[i]));
            }
            activitiesForDB.forEach(el => el.shift());
            dispatch(setSelectedActivities(activitiesForDB));
        }
    },[bookedActivities.length]);

    async function handleConfirm() {
        if (paymentType === '1') {
            navigate("/payment");
        } else if (paymentType === '2' || paymentType === '3') {
            const res = await fetch(`${BASE_URL}/api/v.0.1/booking/create`, {
                method: "post",
                headers: { "Content-Type": "application/json",
                            Authentication: "Bearer " + TOKEN },
                body: JSON.stringify({ 
                    nb_adults: bookingInfo.nb_adults.pack,
                    nb_children: bookingInfo.nb_children.pack,
                    price_total_booking: bookingInfo.prices.total_all,
                    paymentType,
                    status: 'en attente',
                    pack_id: bookingInfo.packID,
                    user_id: userInfo.userID,
                    activities: bookingInfo.selectedActivities
                })
            });
            if (res.status === 201) {
                navigate("/confirmation");
            }
        } else {
            setErrMsg("Veuillez sélectionner une méthode de paiement.");
        }
    }

    return <main id="summary">
            
            {bookingInfo.packID &&
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
                                <b>{activity.name}</b> pour {activity.nb_adults >= 1 && <span><b>{activity.nb_adults}</b> adulte(s) </span>} {(activity.nb_adults >= 1 && activity.nb_children >= 1) && "et"} {activity.nb_children >= 1 && <span><b>{activity.nb_children}</b> enfant(s) </span>}au prix de <b>{activity.price_total_act}</b> &euro;
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
                        <select 
                        defaultValue="0"
                        onChange={(e) => setPaymentType(e.target.value)}>
                            {paymentOptions.map((option) => (
                                <option value={option.value} key={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </label>
                </article>

                { errMsg && <p className={styles.msg_nok}>{errMsg}</p> }

                <MainBtn onClick={handleConfirm} className={styles.confirm_btn} text="confirmer la réservation"/>
            </section>}
        </main>
}

export default Summary;