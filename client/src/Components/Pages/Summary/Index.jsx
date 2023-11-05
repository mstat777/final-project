import styles from './summary.module.css';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

function Summary(){
    const dispatch = useDispatch();
    const navigate = useNavigate();

    let { id } = useParams();

    const { destination } = useSelector((state) => state.allTravel);
    const { packs } = useSelector((state) => state.allTravel);
    const { lodging } = useSelector((state) => state.allTravel);
    const { activities } =  useSelector((state) => state.allTravel);
    const { bookingInfo } = useSelector((state) => state.booking);
    const { userInfo } =  useSelector((state) => state.user);

    const [msg, setMsg] = useState(null);

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
        console.log("Données confirmées. Réservation envoyée.");

        const res = await fetch("/api/v.0.1/user/booking", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                nb_adults: bookingInfo.nb_adults.pack,
                nb_children: bookingInfo.nb_children.pack,
                price_total_booking: bookingInfo.prices.total_all,
                paymentType,
                pack_id: packs[id].id, // l'ID du pack stocké dans 'params'
                user_id: userInfo.userID
            })
        });
        const json = await res.json();
        setMsg(json.msg);
        
        if ( res.status === 201) {
            navigate("/confirmation");
        }
    }

    return (
        <main id="summary">

            <div className={styles.summary_section}>

                <p>Voici le récapitulatif de votre réservation :</p>
                <div className={styles.summary_ctn}>
                    <p>Nom et pays de la destination : <span>{destination.name}</span>, <span>{destination.country}</span></p>
                    <p>Nom de l'hébérgement : <span>{lodging.name}</span></p>
                    <p>Date de départ : <span>{packs[id].departure_date.slice(0, packs[id].departure_date.indexOf('T'))}</span></p>
                    <p>Date de retour : <span>{packs[id].return_date.slice(0, packs[id].return_date.indexOf('T'))}</span></p> 
                    <p>Durée : <span>{packs[id].duration+1}</span> jours / <span>{packs[id].duration}</span> nuits</p>  
                    <p>Nombre d'adultes : <span>{bookingInfo.nb_adults.pack}</span></p>
                    <p>Nombre d'enfants : <span>{bookingInfo.nb_children.pack}</span></p>
                    <p>Prix/TTC/adulte : <span>{packs[id].price_adults}</span> &euro;</p> 
                    <p>Prix/TTC/enfant : <span>{packs[id].price_children}</span> &euro;</p> 
                    <p>Prix du pack (sans activités) : <span>{bookingInfo.prices.total_pack}</span> &euro;</p>
                    <p>Activités choisies : </p>

                    <p>Prix total des activités : <span>{bookingInfo.prices.total_activities}</span> &euro;</p>
                    <hr/>
                    <p>Prix total de la réservation : <span>{bookingInfo.prices.total_all}</span> &euro;</p>

                    <label>
                        Comment souhaitez-vous régler?
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