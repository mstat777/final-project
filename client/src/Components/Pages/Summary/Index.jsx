import styles from './summary.module.css';
import { useState, useEffect } from 'react';
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

    const [bookedActivities, setBookedActivities] = useState([]);

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
        const activitiesForDB = [];
        bookedActivities.forEach(el => {
            delete el.name;
            //el.booking_id = 3;
            activitiesForDB.push(Object.values(el));
        });
        console.log(activitiesForDB);

        /*  ici pour tester qqch :
        const test = 2;
        let newArray = [];
        activitiesForDB.forEach(el => {
            el = [...el, test];
            newArray.push(el);
            console.log(el);
        });
        console.log(newArray); */

        const res = await fetch("/api/v.0.1/user/booking", {
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
                    <ul className={styles.summary_activities}>
                    {bookedActivities.map((activity, index) => 
                        <li key={index}><span>{activity.name}</span> pour <span>{activity.nb_adults}</span> adulte(s) et <span>{activity.nb_children}</span> enfant(s) au prix de <span>{activity.price_total_act}</span> &euro;</li>
                    )}
                    </ul>
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