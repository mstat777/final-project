import styles from './booking.module.css';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useMediaQuery } from "react-responsive";
import { calculatePrices,
        incrNbAdultsPack, 
        decrNbAdultsPack, 
        incrNbChildrenPack,
        decrNbChildrenPack,
        incrNbAdultsActivity, 
        decrNbAdultsActivity,
        incrNbChildrenActivity, 
        decrNbChildrenActivity
    } from "../../../store/slices/booking";
import { verifyBooking } from '../../Functions/verifyBooking';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faCircleMinus } from '@fortawesome/free-solid-svg-icons';

function Booking(){
    const IMG_URL = process.env.REACT_APP_IMG_URL;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // on enregistre l'ID du pack sélectionné :
    let { id } = useParams();

    const { destination } = useSelector((state) => state.allTravel);
    const { packs } = useSelector((state) => state.allTravel);
    const { lodging } = useSelector((state) => state.allTravel);
    const { activities } =  useSelector((state) => state.allTravel);

    // stocker les données de la réservation :
    const { bookingInfo } = useSelector((state) => state.booking);

    // pour stocker les états des checkboxes :
    let myArray = []; 
    activities.forEach(() => {
        myArray.push(false);
    });
    const [checkBoxes, setCheckBoxes] = useState(myArray);

    // remonter au top de la page lors de chargement
    const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
    const isTabletOrDesktop = useMediaQuery({ query: '(min-width: 768px)' });
    useEffect(() => {
        if (isMobile) { window.scrollTo(0, 160); }
        if (isTabletOrDesktop) { window.scrollTo(0, 0); }
    }, [])
    
    //console.log(activities);
    // on récupère tous les prix (pack + activités) de la BDD, les regroupe en arrays pour les passer au Store :
    let prices_adults = [];
    let prices_children = [];
    for (let i = 0; i < activities.length; i++) {
        //console.log("activities[i].price_adults = "+activities[i].price_adults);
        prices_adults[i] = activities[i].price_adults;
        prices_children[i] = activities[i].price_children;
        //console.log("prices_adults[i] = "+prices_adults[i]);
        //console.log("prices_children[i] = "+prices_children[i]);
    }
    // initialiser les variables pour stocker les prix du pack et des activités associées :
    const [pricesList, setPricesList] = useState({
        price_adults_pack: 0,
        price_children_pack: 0,
        price_adults_activities: [],
        price_children_activities: []
    });

    // on passe les prix au Store
    useEffect(() => {
        const initInfoAndSetPrices = async () => { 
            //console.log("activities[0].price_adults = "+activities[0].price_adults);
            const setPrices = async () => {
                //console.log("prices_adults = "+prices_adults);
                //console.log("prices_children = "+prices_children);
                setPricesList({
                    price_adults_pack: packs[id].price_adults,
                    price_children_pack: packs[id].price_children,
                    price_adults_activities: prices_adults,
                    price_children_activities: prices_children
                });
                //console.log("pricesList.price_adults_activities = "+pricesList.price_adults_activities);
                //console.log("pricesList.price_children_activities = "+pricesList.price_children_activities);
            }
            await setPrices();
        }
        if (activities[0]) {
            initInfoAndSetPrices();
        }
    },[activities]);

    // calculer les prix chaque fois le nb de personnes change :
    useEffect(() => {
        if (pricesList.price_adults_activities.length && 
            pricesList.price_children_activities) {
            dispatch(calculatePrices(pricesList));
            //console.log("packs[id].price_adults = "+packs[id].price_adults);
            //console.log("bookingInfo.prices.total_pack = "+bookingInfo.prices.total_pack);
            //console.log("bookingInfo.nb_adults.pack = "+bookingInfo.nb_adults.pack);
        }
    },[bookingInfo.nb_adults, bookingInfo.nb_children]);


    // afficher/cacher (via checkbox) les compteurs pour les activités :
    function handleChange(index) {
        const newArray = [...checkBoxes];
        newArray[index] = !checkBoxes[index];
        //console.log("newArray[index] = "+newArray[index]);
        //console.log(newArray);
        setCheckBoxes(newArray);
    }

    // stocker les erreurs lors de la vérification de la réservation :
    const [errors, setErrors] = useState([]);

    // vérifier la réservation grâce à la fonction verifyBooking et passer à la page Summary, si OK :
    function handleSubmitBooking(){
        setErrors(verifyBooking());
        // si aucune erreur trouvée, passe à la page Summary :
        if (errors.every(el => el === false)) {
            navigate(`/summary/${id}`);
        }
    }

    return <main id="booking">
            { (destination && lodging && packs[0] && activities[0]) &&
            <div className={styles.booking_section}>
                <div className={styles.booking_info_top}>
                    <div className={styles.booking_info_ctn}>
                        <h4>{lodging.name}</h4>
                        <h3>{destination.name}</h3>
                        <p className={styles.booking_info_h}>Vous avez sélectionné le pack suivant :</p>
                        <p>Date de départ : <span>{packs[id].departure_date.slice(0, packs[id].departure_date.indexOf('T'))}</span></p>
                        <p>Date de retour : <span>{packs[id].return_date.slice(0, packs[id].return_date.indexOf('T'))}</span></p> 
                        <p>Durée : <span>{packs[id].duration+1}</span> jours / <span>{packs[id].duration}</span> nuits</p>  
                        <p>Prix/TTC/adulte : <span>{packs[id].price_adults}</span> &euro;</p> 
                        <p>Prix/TTC/enfant : <span>{packs[id].price_children}</span> &euro;</p> 
                    </div>
                    <img src={`${IMG_URL}/img/lodgings/${lodging.url_initial_image}`} alt="" className={styles.main_img}/>
                </div>

                <p>Veuillez indiquer le nombre de personnes pour lesquels vous réservez :</p>
                <div className={styles.booking_inputs_ctn}>
                    <div className={styles.booking_inputs}>
                        <span>Adultes :</span>
                        <button onClick={() => dispatch(incrNbAdultsPack())}>
                            <FontAwesomeIcon icon={faCirclePlus} className={styles.fa_circle}/>
                        </button>
                        <input type="text" 
                            pattern="[0-9]{2}"
                            value={bookingInfo.nb_adults.pack}
                            disabled/>
                        <button onClick={() => dispatch(decrNbAdultsPack())}>
                            <FontAwesomeIcon icon={faCircleMinus} className={styles.fa_circle}/>
                        </button>
                    </div>
                    <div className={styles.booking_inputs}>
                        <span>Enfants :</span>
                        <button onClick={()=>{dispatch(incrNbChildrenPack())}}>
                            <FontAwesomeIcon icon={faCirclePlus} className={styles.fa_circle}/>
                        </button>
                        <input type="text" 
                            pattern="[0-9]{2}"
                            value={bookingInfo.nb_children.pack}
                            disabled/>
                        <button onClick={()=>{dispatch(decrNbChildrenPack())}}>
                            <FontAwesomeIcon icon={faCircleMinus} className={styles.fa_circle}/>
                        </button>
                    </div>
                </div>

                <div className={styles.booking_activities_ctn}>
                    <span>Veuillez choisir entre les activités suivantes :</span>
                    {activities.map((activity, index) => 
                        <div className={styles.booking_activity} key={index}>
                            <div className={styles.booking_activity_title}>
                                <label htmlFor={activity.id}>
                                    <input type="checkbox" 
                                        //name={activity.id}
                                        checked={ checkBoxes[index] } 
                                        onChange={() => handleChange(index)}/>
                                    {activity.name}
                                </label>
                            </div>

                            { checkBoxes[index] && 
                            <div className={styles.booking_activity_inputs}>
                                <span>Adultes :</span>
                                <div>
                                    <button onClick={()=>{dispatch(incrNbAdultsActivity(index))}}>
                                        <FontAwesomeIcon icon={faCirclePlus} className={styles.fa_circle}/>
                                    </button>
                                    <input type="text" 
                                        pattern="[0-9]{2}"
                                        value={bookingInfo.nb_adults.activities[index]} 
                                        disabled/>
                                    <button onClick={()=>{dispatch(decrNbAdultsActivity(index))}}>
                                        <FontAwesomeIcon icon={faCircleMinus} className={styles.fa_circle}/>
                                    </button>
                                </div>

                                <span>Enfants :</span>
                                <div>
                                    <button onClick={()=>{dispatch(incrNbChildrenActivity(index))}}>
                                        <FontAwesomeIcon icon={faCirclePlus} className={styles.fa_circle}/>
                                    </button>
                                    <input type="text" 
                                        pattern="[0-9]{2}"
                                        value={bookingInfo.nb_children.activities[index]}
                                        disabled/>
                                    <button onClick={()=>{dispatch(decrNbChildrenActivity(index))}}>
                                        <FontAwesomeIcon icon={faCircleMinus} className={styles.fa_circle}/>
                                    </button>
                                </div>
                            </div>}

                            <div>
                                <p>Type : {activity.type}</p>
                                <p>Prix : adultes: {activity.price_adults}&euro;, enfants : {activity.price_children}&euro;</p>
                                <p>{activity.overview}</p>
                            </div> 
                            
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
                    {errors.map((el, idx) => el[idx] &&
                    <p>Erreur : {errors[idx]}</p>)}
                </div>

            </div>
            }
        </main>
}

export default Booking;