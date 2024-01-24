import styles from './Booking.module.scss';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
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
import { formatDate } from '../../Functions/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faCircleMinus } from '@fortawesome/free-solid-svg-icons';
import Loading from '../../Containers/Loading/Index';
import MainBtn from '../../Containers/buttons/MainBtn/Index';

function Booking(){
    const IMG_URL = process.env.REACT_APP_IMG_URL;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // le numéro du pack sélectionné (n'est pas l'ID !) :
    const { id } = useParams();

    const { destination, 
            lodging, 
            packs, 
            activities } = useSelector((state) => state.allTravel);
    // stocker les données de la réservation :
    const { bookingInfo } = useSelector((state) => state.booking);

    // le bouton Submit clické ou pas
    const [isSubmitPressed, setIsSubmitPressed] = useState(false);

    // stocker les erreurs lors de la vérification de la réservation :
    const [errors, setErrors] = useState([]);

    // pour stocker les états des checkboxes :
    let myArray = []; 
    activities.forEach((el, i) => {
        (bookingInfo.nb_adults.activities[i] || bookingInfo.nb_children.activities[i]) ? myArray.push(true) : myArray.push(false);
    });
    const [checkBoxes, setCheckBoxes] = useState(myArray);

    // remonter au top de la page lors de chargement
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])
    
    // on récupère tous les prix (pack + activités) de la BDD, les regroupe en arrays pour les passer au Store :
    let prices_adults = [];
    let prices_children = [];
    for (let i = 0; i < activities.length; i++) {
        prices_adults[i] = activities[i].price_adults;
        prices_children[i] = activities[i].price_children;
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
            const setPrices = async () => {
                setPricesList({
                    price_adults_pack: packs[id].price_adults,
                    price_children_pack: packs[id].price_children,
                    price_adults_activities: prices_adults,
                    price_children_activities: prices_children
                });
            }
            await setPrices();
        }
        if (activities[0] && packs[id]) {
            initInfoAndSetPrices();
        }
    },[activities[0], packs[id]]);

    // calculer les prix chaque fois le nb de personnes change :
    useEffect(() => {
        if (pricesList.price_adults_activities.length && 
            pricesList.price_children_activities) {
            dispatch(calculatePrices(pricesList));
        }
    },[bookingInfo.nb_adults, bookingInfo.nb_children, pricesList]);

    // afficher/cacher (via checkbox) les compteurs pour les activités :
    function handleChange(index) {
        const newArray = [...checkBoxes];
        newArray[index] = !checkBoxes[index];
        setCheckBoxes(newArray);
    }

    // passer à la page Summary, si la vérif est OK :
    useEffect(() => {
        if (isSubmitPressed && !errors[0]) {
            navigate(`/summary/${id}`);
        }
    },[isSubmitPressed, errors[0]]);

    function handleSubmitBooking(){
        setErrors(verifyBooking(packs[id], activities, checkBoxes)); // vérifier les inputs
        setIsSubmitPressed(true);
    }

    return <main id="booking">
            { !(destination && lodging && packs[id] && activities[0]) ? 
                <Loading/> :
            <section className={styles.booking_section}>
                <h1 className={styles.hidden}>Paramétrer votre réservation</h1>

                <article className={styles.booking_info_top}>
                    <h2>Information concernant le pack choisi</h2>
                    <div className={styles.booking_info_ctn}>
                        <h3>{lodging.name}</h3>
                        <p className={styles.destination_name}>{destination.name}</p>
                        <p className={styles.booking_info_h}>Vous avez sélectionné le pack suivant :</p>
                        <p>Date de départ : <b>{formatDate(packs[id].departure_date)}</b></p>
                        <p>Date de retour : <b>{formatDate(packs[id].return_date)}</b></p> 
                        <p>Durée : <b>{packs[id].duration+1}</b> jours / <b>{packs[id].duration}</b> nuits</p>  
                        <p>Prix/TTC/adulte : <b>{packs[id].price_adults}</b> &euro;</p> 
                        <p>Prix/TTC/enfant : <b>{packs[id].price_children}</b> &euro;</p> 
                        {(packs[id].places_left < 11) && <p className={styles.places_left}>Il ne reste que {packs[id].places_left} places !</p>}
                    </div>
                    <img src={`${IMG_URL}/img/lodgings/${lodging.url_initial_image}`} alt="l'hébergement" className={styles.main_img}/>
                </article>

                <article className={styles.booking_inputs_ctn}>
                    <h2>Nombres de personnes</h2>
                    <p>Veuillez indiquer le nombre de personnes pour lesquels vous réservez ce pack :</p>
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
                </article>

                <section className={styles.booking_activities_ctn}>
                    <h2>Les activités à choisir</h2>
                    <p>Veuillez choisir entre les activités suivantes :</p>
                    {activities.map((activity, i) => 
                        <article className={styles.booking_activity} key={i}>
                            <div className={styles.booking_activity_title}>
                                <label htmlFor={activity.id}>
                                    <input type="checkbox" 
                                        id={activity.id}
                                        checked={ checkBoxes[i] } 
                                        onChange={() => handleChange(i)}/>
                                    <span>{activity.name}</span>
                                </label>
                            </div>

                            { checkBoxes[i] && 
                            <div className={styles.booking_activity_inputs}>
                                <div>
                                    <span>Adultes :</span>
                                    <button onClick={()=>{dispatch(incrNbAdultsActivity(i))}}>
                                        <FontAwesomeIcon icon={faCirclePlus} className={styles.fa_circle}/>
                                    </button>
                                    <input type="text" 
                                        pattern="[0-9]{2}"
                                        value={bookingInfo.nb_adults.activities[i]} 
                                        disabled/>
                                    <button onClick={()=>{dispatch(decrNbAdultsActivity(i))}}>
                                        <FontAwesomeIcon icon={faCircleMinus} className={styles.fa_circle}/>
                                    </button>
                                </div>

                                <div>
                                    <span>Enfants :</span>
                                    <button onClick={()=>{dispatch(incrNbChildrenActivity(i))}}>
                                        <FontAwesomeIcon icon={faCirclePlus} className={styles.fa_circle}/>
                                    </button>
                                    <input type="text" 
                                        pattern="[0-9]{2}"
                                        value={bookingInfo.nb_children.activities[i]}
                                        disabled/>
                                    <button onClick={()=>{dispatch(decrNbChildrenActivity(i))}}>
                                        <FontAwesomeIcon icon={faCircleMinus} className={styles.fa_circle}/>
                                    </button>
                                </div>
                            </div>}

                            <div>
                                <p>Type : {activity.type}</p>
                                <p>Prix : adultes: {activity.price_adults}&euro;, enfants : {activity.price_children}&euro;</p>
                                {(activity.places_left < 11) && <p className={styles.places_left}>Il ne reste que {activity.places_left} places !</p>}
                                <p>{activity.overview}</p>
                            </div> 
                            
                        </article>
                    )}
                </section>

                <article className={styles.booking_totals_ctn}>
                    <h2>Récapitulatif des montants à payer</h2>
                    <p>Vous avez sélectionné le pack suivant :</p>
                    <p>Prix total du pack : <b>{bookingInfo.prices.total_pack}</b> &euro; TTC</p> 
                    <p>Prix total des activités choisies : <b>{bookingInfo.prices.total_activities}</b> &euro; TTC</p> 
                    <p>PRIX TOTAL A PAYER : <b>{bookingInfo.prices.total_all}</b> &euro; TTC</p> 
                </article>

                <MainBtn onClick={handleSubmitBooking} className={styles.booking_btn} text="réserver"/>

                <div className={styles.error_ctn}>
                    {errors.map((el, i) => el[i] &&
                    <p key={i}>Erreur : {errors[i]}</p>)}
                </div>

            </section>}
        </main>
}

export default Booking;