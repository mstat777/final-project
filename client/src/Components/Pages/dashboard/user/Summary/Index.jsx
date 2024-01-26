import styles from '../../../Summary/Summary.module.scss';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { formatDate } from '../../../../Functions/utils';
import MainBtn from '../../../../Containers/buttons/MainBtn/Index';
import { setNewBookedAct, setOldBookedAct } from '../../../../../store/slices/booking';

function UserDashBookingModifiedSummary() {
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const TOKEN = localStorage.getItem("auth");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // sélectionner le 1er pack suite à la fetch :
    const id = 0;

    const { destination, packs, lodging, activities } = useSelector((state) => state.allTravel);
    const { bookingInfo, bookedData, newBookedAct, oldBookedAct } = useSelector((state) => state.booking);

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

    // l'ANCIEN ETAT des activités réservées 
    useEffect(() => {
        function getOldActivities(){
            const oldArray = [];
            for(let i = 0; i < activities.length; i++){
                const myObject = {
                    nbAdults: 0,
                    nbChildren: 0,
                    priceTotalAct: 0,
                    activityID: 0,
                    id: 0
                };
    
                for(let j = 0; j < bookedData.datasBookAct.length; j++){
                    if (bookedData.datasBookAct[j].activity_id === activities[i].id) {
                        myObject.nbAdults = bookedData.datasBookAct[j].nb_adults;
                        myObject.nbChildren = bookedData.datasBookAct[j].nb_children;
                        myObject.priceTotalAct = bookedData.datasBookAct[j].price_total_act;
                        myObject.activityID = bookedData.datasBookAct[j].activity_id;
                        myObject.id = bookedData.datasBookAct[j].id;
                    } 
                } 
                oldArray.push(myObject);
            }
            return oldArray;
        }
        if (bookedData.datasBookAct.length){
            dispatch(setOldBookedAct(getOldActivities()));
        }
    }, [bookedData.datasBookAct.length]);

    // le NOUVEL ETAT des activités réservées à envoyer dans la BDD
    useEffect(() => {
        function getNewActivities(){
            const newArray = [];
    
            for(let i = 0; i < activities.length; i++){
                const myObject = {
                    nbAdults: 0,
                    nbChildren: 0,
                    priceTotalAct: 0,
                    activityID: 0,
                    bookingID: 0,
                    name: ''
                };
                if (bookingInfo.nbAdults.activities[i] || bookingInfo.nbChildren.activities[i]) {
                    myObject.nbAdults = bookingInfo.nbAdults.activities[i];
                    myObject.nbChildren = bookingInfo.nbChildren.activities[i];
                    myObject.priceTotalAct = bookingInfo.prices.totalAdults[i] + bookingInfo.prices.totalChildren[i];
                    myObject.activityID = activities[i].id;
                    myObject.bookingID = bookedData.datasBook[0].id;
                    myObject.name = activities[i].name;
                }
                newArray.push(myObject);
            }
            return newArray;
        }
        if (bookedData.datasBook[0]) {
            dispatch(setNewBookedAct(getNewActivities()));
        }
    },[bookedData.datasBook[0]])

    async function handleConfirm() {
        if (paymentType === '1') {
            navigate("/payment");
        } else if (paymentType === '2' || paymentType === '3') {
            const res = await fetch(`${BASE_URL}/api/v.0.1/booking/modify`, {
                method: "POST",
                headers: { "Content-Type": "application/json",
                            Authentication: "Bearer " + TOKEN },
                body: JSON.stringify({ 
                    nbAdults: bookingInfo.nbAdults.pack,
                    nbChildren: bookingInfo.nbChildren.pack,
                    priceTotalBooking: bookingInfo.prices.totalAll,
                    paymentType,
                    status: 'en attente',
                    bookingID: bookedData.datasBook[0].id,
                    newBookedActiv: newBookedAct,
                    oldBookedActiv: oldBookedAct
                })
            });
            if ( res.status === 201) {
                navigate("/confirmation");
            }
        } else {
            setErrMsg("Veuillez sélectionner une méthode de paiement.");
        }  
    }

    return <main id="summary">
            {(destination && lodging && packs[0] && activities[0] && bookingInfo.nbAdults && bookedData.datasBook[0]) &&
            <section className={`${styles.summary_section} ${styles.modify_section}`}>
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
                    {newBookedAct.length ?
                        <ul className={styles.summary_activities}>
                        {newBookedAct.filter(el => el.nbAdults > 0 || el.nbChildren > 0).map((activity, i) => 
                            <li key={i}>
                                <b>{activity.name}</b> pour {activity.nbAdults >= 1 && <span><b>{activity.nbAdults}</b> adulte(s) </span>} {(activity.nbAdults >= 1 && activity.nbChildren >= 1) && "et"} {activity.nbChildren >= 1 && <span><b>{activity.nbChildren}</b> enfant(s) </span>}au prix de <b>{activity.priceTotalAct}</b> &euro;
                            </li>
                        )}
                        </ul> : <span><b> aucune activité choisie</b></span>
                    }
                    <p>Prix total des activités : <b>{bookingInfo.prices.totalActivities}</b> &euro;</p>
                    <hr/>
                    <p>Prix total de la réservation : <b>{bookingInfo.prices.totalAll}</b> &euro;</p>

                    {/* si l'utilisateur n'a pas encore payé : */}
                    {bookedData.datasBook[0].status !== "validée" ? 
                        <p>A PAYER : <b>{bookingInfo.prices.totalAll}</b> &euro;</p> : null}

                    {/* si l'utilisateur a déjà payé : */}
                    {bookedData.datasBook[0].status === "validée" && <>
                        <p>Montant déjà payé : <b>{parseFloat(bookedData.datasBook[0].price_total_booking)}</b> &euro; TTC</p> 
                        <p>RESTE A PAYER : <b>{bookingInfo.prices.totalAll - bookedData.datasBook[0].price_total_booking}</b> &euro; TTC</p> 
                    </>}
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
                                <option value={option.value} key={option.value}>{option.label}
                                </option>
                            ))}
                        </select>
                    </label>
                </article>

                { errMsg && <p className={styles.msg_nok}>{errMsg}</p> }

                <MainBtn onClick={handleConfirm} className={styles.confirm_btn} text="confirmer la réservation"/>
            </section>}
        </main>
}

export default UserDashBookingModifiedSummary;