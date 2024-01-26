import styles from './Summary.module.scss';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { formatDate } from '../../Functions/utils';
import MainBtn from '../../Containers/buttons/MainBtn/Index';
import { setPackID, setSelectedActivities } from '../../../store/slices/booking';

function Summary(){
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const TOKEN = localStorage.getItem("auth");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { id } = useParams();

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
        if(packs[id]) {
            dispatch(setPackID(packs[id].id));
        }
    }, [packs[id]]);

    // récupérer les données uniquement des activités réservées pour pouvoir les envoyer dans la BDD
    useEffect(() => {
        function findBookedActivities(){
            const myArray = [];
            for(let i = 0; i < activities.length; i++){
                const myObject = {};
                myObject.name = activities[i].name;
                myObject.nbAdults = bookingInfo.nbAdults.activities[i];
                myObject.nbChildren = bookingInfo.nbChildren.activities[i];
                myObject.priceTotalAct = bookingInfo.prices.totalAdults[i] + bookingInfo.prices.totalChildren[i];
                myObject.activityID = activities[i].id;

                myArray.push(myObject);
            }
            const filtered = myArray.filter(el => el.nbAdults > 0 || el.nbChildren > 0);
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
                    nbAdults: bookingInfo.nbAdults.pack,
                    nbChildren: bookingInfo.nbChildren.pack,
                    priceTotalBooking: bookingInfo.prices.totalAll,
                    paymentType,
                    status: 'en attente',
                    packID: bookingInfo.packID,
                    userID: userInfo.userID,
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
                    <p>Nombre d'adultes : <b>{bookingInfo.nbAdults.pack}</b></p>
                    <p>Nombre d'enfants : <b>{bookingInfo.nbChildren.pack}</b></p>
                    <p>Prix du pack (sans activités) : <b>{bookingInfo.prices.totalPack}</b> &euro;</p>
                    <p>Activités choisies : </p>
                    {bookedActivities.length ?
                        <ul className={styles.summary_activities}>
                        {bookedActivities.map((activity, i) => 
                            <li key={i}>
                                <b>{activity.name}</b> pour {activity.nbAdults >= 1 && <span><b>{activity.nbAdults}</b> adulte(s) </span>} {(activity.nbAdults >= 1 && activity.nbChildren >= 1) && "et"} {activity.nbChildren >= 1 && <span><b>{activity.nbChildren}</b> enfant(s) </span>}au prix de <b>{activity.priceTotalAct}</b> &euro;
                            </li>
                        )}
                        </ul> : <span><b> aucune activité choisie</b></span>
                    }
                    <p>Prix total des activités : <b>{bookingInfo.prices.totalActivities}</b> &euro;</p>
                    <hr/>
                    <p>Prix total de la réservation : <b>{bookingInfo.prices.totalAll}</b> &euro;</p>
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