import styles from './booking.module.css';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { calculatePrices,
        resetCounters,
        initialiseCounters, 
        increaseNumberAdultsPack, 
        decreaseNumberAdultsPack, 
        increaseNumberChildrenPack,
        decreaseNumberChildrenPack,
        increaseNumberAdultsActivity, 
        decreaseNumberAdultsActivity,
        increaseNumberChildrenActivity, 
        decreaseNumberChildrenActivity
    } from "../../../store/slices/booking";
import { verifyBooking } from '../../Functions/verifyBooking';

function Booking(){
    const dispatch = useDispatch();

    // on enregistre l'ID du pack sélectionné :
    let { id } = useParams();

    const { destination } = useSelector((state) => state.allTravel);
    
    const { packs } = useSelector((state) => state.allTravel);
    const { lodging } = useSelector((state) => state.allTravel);
    const { activities } =  useSelector((state) => state.allTravel);

    // stocker les données de la réservation :
    const { bookingInfo } = useSelector((state) => state.booking);

    // on récupère les prix tels qu'indiqués dans la BDD pour les passer au state :
    let prices_adults = [];
    let prices_children = [];
    for (let i = 0; i < activities.length; i++) {
        //console.log("activities[i].price_adults = "+activities[i].price_adults);
        prices_adults[i] = activities[i].price_adults;
        prices_children[i] = activities[i].price_children;
        //console.log("prices_adults[i] = "+prices_adults[i]);
        //console.log("prices_children[i] = "+prices_children[i]);
    }

    // stocker les prix du pack et des activités associées :
    const [pricesList, setPricesList] = useState({
        price_adults_pack: 0,
        price_children_pack: 0,
        price_adults_activities: [],
        price_children_activities: []
    });

    // remonter au top de la page lors de chargement
    useEffect(() => {
        document.getElementById("booking").scrollIntoView();
    }, [])

    // on initialise les données des activitées (nb personnes, prix)
    useEffect(() => {
        const initInfoAndSetPrices = async () => { 
            //console.log("activities[0].price_adults = "+activities[0].price_adults);
            //console.log("prices_adults = "+prices_adults);
            //console.log("prices_children = "+prices_children);

            const setPrices = async () => {
                setPricesList({
                    price_adults_pack: packs[id].price_adults,
                    price_children_pack: packs[id].price_children,
                    price_adults_activities: prices_adults,
                    price_children_activities: prices_children
                })
            }
            await setPrices();
            /*
            const checkPrices = () => {
                console.log("pricesList.price_adults_activities = "+pricesList.price_adults_activities);
                console.log("pricesList.price_children_activities = "+pricesList.price_children_activities);
            }
            checkPrices();*/
        }

        initInfoAndSetPrices();
    },[activities]);

    // calculer les prix selon le nb de personnes :
    useEffect(() => {
        dispatch(calculatePrices(pricesList));
        //console.log("packs[id].price_adults = "+packs[id].price_adults);
        //console.log("bookingInfo.prices.total_pack = "+bookingInfo.prices.total_pack);
        //console.log("bookingInfo.nb_adults.pack = "+bookingInfo.nb_adults.pack);
    },[bookingInfo.nb_adults, bookingInfo.nb_children]);

    // pour stocker les états des checkboxes :
    let myArray = []; 
    activities.forEach(() => {
        myArray.push(false);
    });
    const [checkBoxes, setCheckBoxes] = useState(myArray);

    // afficher/cacher les compteurs pour les activités :
    function handleChange(index) {
        const newArray = [...checkBoxes];
        newArray[index] = !checkBoxes[index];
        console.log("newArray[index] = "+newArray[index]);
        console.log(newArray);
        setCheckBoxes(newArray);
    }

    // vérifier la réservation grâce à la fonction verifyBooking et passer à la page Summary, si OK :
    function handleSubmitBooking(){
        setErrors(verifyBooking());
    }

    // stocker les erreurs lors de la vérification de la réservation :
    const [errors, setErrors] = useState([]);

    return (
        <main id="booking">
            { (destination && lodging && activities) &&
            <div className={styles.booking_section}>
                <img src={"../../img/lodgings/"+lodging.url_initial_image} alt="" />
                <h4>{lodging.name}</h4>
                <h3>{destination.name}</h3>
    
                <p>Vous avez sélectionné le pack suivant :</p>
                <div className={styles.booking_pack_ctn}>
                    <p>Date de départ : <span>{packs[id].departure_date.slice(0, packs[id].departure_date.indexOf('T'))}</span></p>
                    <p>Date de retour : <span>{packs[id].return_date.slice(0, packs[id].return_date.indexOf('T'))}</span></p> 
                    <p>Durée : <span>{packs[id].duration+1}</span> jours / <span>{packs[id].duration}</span> nuits</p>  
                    <p>Prix/TTC/adulte : {packs[id].price_adults} &euro;</p> 
                    <p>Prix/TTC/enfant : {packs[id].price_children} &euro;</p> 
                </div>

                <p>Veuillez indiquer le nombre d'adultes et d'enfants pour lesquels vous réservez :</p>
                <div className={styles.booking_inputs}>
                    <span>Nombre d'adultes :&nbsp;</span>
                    <button onClick={()=>{dispatch(increaseNumberAdultsPack())}}>+</button>
                    <input type="number" value={bookingInfo.nb_adults.pack} />
                    <button onClick={()=>{dispatch(decreaseNumberAdultsPack())}}>-</button>
                </div>
                <div className={styles.booking_inputs}>
                    <span>Nombre d'enfants :&nbsp;</span>
                    <button onClick={()=>{dispatch(increaseNumberChildrenPack())}}>+</button>
                    <input type="number" value={bookingInfo.nb_children.pack} />
                    <button onClick={()=>{dispatch(decreaseNumberChildrenPack())}}>-</button>
                </div>

                <div className={styles.booking_activities_ctn}>
                    <span>Veuillez choisir entre les activités suivantes :</span>
                    {activities.map((activity, index) => 
                        <div className={styles.booking_activity} key={index}>
                            <div className={styles.booking_activity_title} >
                                <input type="checkbox" 
                                        //name={activity.id}
                                        checked={ checkBoxes[index] } 
                                        onChange={() => handleChange(index)}/>
                                <label for={activity.id}>{activity.name}</label>
                            </div>

                            { checkBoxes[index] && 
                            <div className={styles.booking_activity_inputs}>
                                <span>Adultes : </span>
                                <button onClick={()=>{dispatch(increaseNumberAdultsActivity(index))}}>+</button>
                                <input type="number" value={bookingInfo.nb_adults.activities[index]} />
                                <button onClick={()=>{dispatch(decreaseNumberAdultsActivity(index))}}>-</button>

                                <span>Children : </span>
                                <button onClick={()=>{dispatch(increaseNumberChildrenActivity(index))}}>+</button>
                                <input type="number" value={bookingInfo.nb_children.activities[index]} />
                                <button onClick={()=>{dispatch(decreaseNumberChildrenActivity(index))}}>-</button>
                            </div>}

                            <div>
                                <p>Type: {activity.type}</p>
                                <p>Prix: adultes: {activity.price_adults}&euro;, enfants: {activity.price_children}&euro;</p>
                            </div> 
                            <p>{activity.overview}</p>
                        </div>
                    )}
                </div>

                <p>Vous avez sélectionné le pack suivant :</p>
                <div className={styles.booking_pack_ctn}>
                    <p>Prix total du pack : <span>{bookingInfo.prices.total_pack}</span> &euro; TTC</p> 
                    <p>Prix total des activités choisies : <span>{bookingInfo.prices.total_activities}</span> &euro; TTC</p> 
                    <p>PRIX TOTAL A PAYER : <span>{bookingInfo.prices.total_all}</span> &euro; TTC</p> 
                </div>

                <button onClick={handleSubmitBooking} className={styles.booking_btn}>réserver</button>

                <div className={styles.error_ctn}>
                {errors.map((activity, idx) => errors[idx] &&
                <p>Erreur : {errors[idx]}</p>)}
                </div>

            </div>
            }
        </main>
    )
}

export default Booking;