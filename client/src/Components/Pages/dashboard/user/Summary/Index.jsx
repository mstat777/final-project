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
            console.log(activities);
            for(let i = 0; i < activities.length; i++){
                const myObject = {
                    nb_adults: 0,
                    nb_children: 0,
                    price_total_act: 0,
                    activity_id: 0,
                    id: 0
                };
    
                for(let j = 0; j < bookedData.datasBookAct.length; j++){
                    if (bookedData.datasBookAct[j].activity_id === activities[i].id) {
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
        if (bookedData.datasBookAct.length){
            console.log(bookedData);
            dispatch(setOldBookedAct(getOldActivities()));
        }
    }, [bookedData.datasBookAct.length]);

    // le NOUVEL ETAT des activités réservées à envoyer dans la BDD
    useEffect(() => {
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
            console.log(newArray);
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
            console.log(newBookedAct);
            console.log(oldBookedAct);
            const res = await fetch(`${BASE_URL}/api/v.0.1/booking/modify`, {
                method: "POST",
                headers: { "Content-Type": "application/json",
                            Authentication: "Bearer " + TOKEN },
                body: JSON.stringify({ 
                    nb_adults: bookingInfo.nb_adults.pack,
                    nb_children: bookingInfo.nb_children.pack,
                    price_total_booking: bookingInfo.prices.total_all,
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
            {(destination && lodging && packs[0] && activities[0] && bookingInfo.nb_adults && bookedData.datasBook[0]) &&
            <section className={`${styles.summary_section} ${styles.modify_section}`}>
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
                    {newBookedAct.length ?
                        <ul className={styles.summary_activities}>
                        {newBookedAct.filter(el => el.nb_adults > 0 || el.nb_children > 0).map((activity, i) => 
                            <li key={i}>
                                <b>{activity.name}</b> pour {activity.nb_adults >= 1 && <span><b>{activity.nb_adults}</b> adulte(s) </span>} {(activity.nb_adults >= 1 && activity.nb_children >= 1) && "et"} {activity.nb_children >= 1 && <span><b>{activity.nb_children}</b> enfant(s) </span>}au prix de <b>{activity.price_total_act}</b> &euro;
                            </li>
                        )}
                        </ul> : <span><b> aucune activité choisie</b></span>
                    }
                    <p>Prix total des activités : <b>{bookingInfo.prices.total_activities}</b> &euro;</p>
                    <hr/>
                    <p>Prix total de la réservation : <b>{bookingInfo.prices.total_all}</b> &euro;</p>

                    {/* si l'utilisateur n'a pas encore payé : */}
                    {bookedData.datasBook[0].status !== "validée" ? 
                        <p>A PAYER : <b>{bookingInfo.prices.total_all}</b> &euro;</p> : null}

                    {/* si l'utilisateur a déjà payé : */}
                    {bookedData.datasBook[0].status === "validée" && <>
                        <p>Montant déjà payé : <b>{parseFloat(bookedData.datasBook[0].price_total_booking)}</b> &euro; TTC</p> 
                        <p>RESTE A PAYER : <b>{bookingInfo.prices.total_all - bookedData.datasBook[0].price_total_booking}</b> &euro; TTC</p> 
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