import styles from '../../../Booking/Booking.module.scss';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
        decrNbChildrenActivity,
        setNbInBooking
    } from "../../../../../store/slices/booking.js";
import { setDestination, setPacks, setLodging, setActivities } from '../../../../../store/slices/travel.js';
import { verifyBooking } from '../../../../Functions/verifyBooking';
import { formatDate } from '../../../../Functions/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faCircleMinus } from '@fortawesome/free-solid-svg-icons';
import MainBtn from '../../../../Containers/buttons/MainBtn/Index';

function ModifyBooking(){
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const IMG_URL = process.env.REACT_APP_IMG_URL;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // stocker les données de l'ancienne ("bookedData") et la nouvelle ("bookingInfo") réservations :
    const { bookedData, bookingInfo } = useSelector((state) => state.booking);
    const { userInfo } = useSelector((state) => state.user);
    const { destination, lodging, packs, activities } = useSelector((state) => state.allTravel);

    // on récupère l'ID du pack sélectionné :
    const packID = userInfo.modifPackID;

    // le bouton Submit clické ou pas
    const [isSubmitPressed, setIsSubmitPressed] = useState(false);

    const [ isAllDataLoaded, setIsAllDataLoaded ] = useState(false);

    // stocker les états des checkboxes (on connait pas le nb) :
    const [checkBoxes, setCheckBoxes] = useState([]);

    // stocker les erreurs lors de la vérification de la réservation :
    const [errors, setErrors] = useState([]);

    // remonter au top de la page lors de chargement
    const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
    const isTabletOrDesktop = useMediaQuery({ query: '(min-width: 768px)' });
    useEffect(() => {
        if (isMobile) { window.scrollTo(0, 160); }
        if (isTabletOrDesktop) { window.scrollTo(0, 0); }
    }, [])

    // initialiser les variables pour stocker les prix du pack et des activités associées :
    const [pricesList, setPricesList] = useState({
        priceAdultsPack: 0,
        priceChildrenPack: 0,
        priceAdultsActivities: [],
        priceChildrenActivities: []
    });
    
    // on récupère toutes les données liées au pack lors du 1er chargement de la page :
    useEffect(() => {
        async function fetchPackAllData(){
            try {
                const dataAll = await (await fetch(`${BASE_URL}/api/v.0.1/travel/pack-all-data/${packID}`)).json();
                dispatch(setDestination(dataAll.datasDest[0]));
                dispatch(setPacks(dataAll.datasPacks));
                dispatch(setLodging(dataAll.datasLodg[0]));
                dispatch(setActivities(dataAll.datasAct));
            } catch (error) {
                console.log(error);
            }
        }
        fetchPackAllData();
    },[]);
    
    // récupérer les NOMBRES DE PERSONNES pour chaque activité réservée et pour le pack :
    useEffect(() => {
        if (destination && lodging && packs[0] && activities[0] && bookedData){    
            const adultsBookedAct = [];
            const childrenBookedAct = [];
            for (let i = 0; i < activities.length; i++) {
                adultsBookedAct.push(0);
                childrenBookedAct.push(0);
            }
            for (let i = 0; i < activities.length; i++) {
                for (let j = 0; j < bookedData.datasBookAct.length; j++) {
                    if (bookedData.datasBookAct[j].activity_id === activities[i].id) {
                        adultsBookedAct[i] = bookedData.datasBookAct[j].nb_adults;
                        childrenBookedAct[i] = bookedData.datasBookAct[j].nb_children;
                    } 
                }
            }

            // et on les enregistre dans Store :
            const numberPeople = {
                nbAdults: {
                    pack: bookedData.datasBook[0].nb_adults,
                    activities: adultsBookedAct
                },
                nbChildren: {
                    pack: bookedData.datasBook[0].nb_children,
                    activities: childrenBookedAct
                }
            }
            dispatch(setNbInBooking(numberPeople));
        }
    },[destination, lodging, packs[0], activities[0]], JSON.stringify(bookedData));

    // si on a les nb de personnes -> on récupère LES PRIX PAR PERSONNE (pack & activités), les formatte et les stocke dans le Store (pour pouvoir les afficher):
    useEffect(() => {  
        if (bookingInfo.nbAdults.pack) {
            // initialiser les checkboxes :
            let myArray = []; 
            activities.forEach((el, i) => {
                bookingInfo.nbAdults.activities[i] || bookingInfo.nbChildren.activities[i] ?
                myArray.push(true) : myArray.push(false);
            });
            setCheckBoxes(myArray);
            
            // des variables pour stocker tous les prix (du pack et des activités) qu'on va récupèrer de la BDD, les regroupe en arrays pour les passer au Store :
            let pricesAdults = [];
            let pricesChildren = [];
            for (let i = 0; i < bookedData.datasAct.length; i++) {
                pricesAdults[i] = parseFloat(bookedData.datasAct[i].price_adults);
                pricesChildren[i] = parseFloat(bookedData.datasAct[i].price_children);
            }
            setPricesList({
                priceAdultsPack: parseFloat(bookedData.datasPack[0].price_adults),
                priceChildrenPack: parseFloat(bookedData.datasPack[0].price_children),
                // on a récupéré les prix de toutes les activités ci-dessus
                priceAdultsActivities: pricesAdults,
                priceChildrenActivities: pricesChildren
            });
        }
    },[JSON.stringify(bookingInfo.nbAdults), JSON.stringify(bookingInfo.nbChildren)]);

    // si toutes les données sont chargées, on peut afficher la page :
    useEffect(() => {
        if (bookingInfo.prices.totalAll) {
            setIsAllDataLoaded(true);
        }
    },[bookingInfo.prices.totalAll]);

    // CALCULER LES PRIX TOTAUX chaque fois le nb de personnes change :
    useEffect(() => {
        if (bookingInfo.nbAdults.pack && 
            pricesList.priceAdultsActivities.length) {
            dispatch(calculatePrices(pricesList));
        }
    },[bookingInfo.nbAdults, bookingInfo.nbChildren, pricesList.priceAdultsActivities.length]);

    // afficher/cacher (via checkbox) les compteurs pour les activités :
    function handleChange(index) {
        const newArray = [...checkBoxes];
        newArray[index] = !checkBoxes[index];
        setCheckBoxes(newArray);
    }

    // passer à la page Summary, si la vérif est OK :
    useEffect(() => {
        if (isSubmitPressed && !errors[0]) {
            navigate(`/db/user/booking-modify-summary`);
        }
    },[isSubmitPressed, errors[0]]);

    // vérifier la réservation grâce à la fonction verifyBooking et passer à la page Booking Modified Summary, si OK :
    function handleSaveBooking(){
        setErrors(verifyBooking(packs[0], activities, checkBoxes, "modify")); // vérifier les inputs
        setIsSubmitPressed(true);
    }

    return <main id="booking-modify">
            {isAllDataLoaded &&
            <section className={`${styles.booking_section} ${styles.modify_section}`}>
                <h1>modifier votre réservation</h1>
                <article className={styles.booking_info_top}>
                    <h2>Information concernant le pack choisi</h2>
                    <div className={styles.booking_info_ctn}>
                        <h3>{lodging.name}</h3>
                        <p className={styles.destination_name}>{destination.name}</p>
                        <p>Paramètres du pack :</p>
                        <p>Date de départ : <b>{formatDate(packs[0].departure_date)}</b></p>
                        <p>Date de retour : <b>{formatDate(packs[0].return_date)}</b></p> 
                        <p>Durée : <b>{packs[0].duration+1}</b> jours / <b>{packs[0].duration}</b> nuits</p>  
                        <p>Prix/TTC/adulte : <b>{packs[0].price_adults}</b> &euro;</p> 
                        <p>Prix/TTC/enfant : <b>{packs[0].price_children}</b> &euro;</p> 
                    </div>
                    <img src={`${IMG_URL}/img/lodgings/${lodging.url_initial_image}`} alt="image de l'hébergement" className={styles.main_img}/>
                </article>

                <article className={styles.booking_inputs_ctn}>
                    <h2>Nombres de personnes</h2>
                    <p>Nombre d'adultes et d'enfants pour lesquels vous avez réservé ce pack :</p>
                    <div className={styles.booking_inputs}> 
                        <span>Adultes :</span>
                        <button onClick={()=>{dispatch(incrNbAdultsPack())}}>
                            <FontAwesomeIcon icon={faCirclePlus} className={styles.fa_circle}/>
                        </button>
                        <input type="text" 
                            pattern="[0-9]{2}"
                            value={bookingInfo.nbAdults.pack}
                            disabled/>
                        <button onClick={()=>{dispatch(decrNbAdultsPack())}}>
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
                            value={bookingInfo.nbChildren.pack}
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
                                        value={bookingInfo.nbAdults.activities[i]} 
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
                                        value={bookingInfo.nbChildren.activities[i]} 
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
                    <p>Prix total du pack : <b>{bookingInfo.prices.totalPack}</b> &euro; TTC</p> 
                    <p>Prix total des activités choisies : <b>{bookingInfo.prices.totalActivities}</b> &euro; TTC</p> 
                    <p>Prix total (pack + activités) : <b>{bookingInfo.prices.totalAll}</b> &euro; TTC</p> 

                    {/* si l'utilisateur a déjà payé : */}
                    {bookedData.datasBook[0].status === "validée" && <>
                        <p>Montant déjà payé : <b>{parseFloat(bookedData.datasBook[0].price_total_booking)}</b> &euro; TTC</p> 
                        <p>RESTE A PAYER : <b>{bookingInfo.prices.totalAll - bookedData.datasBook[0].price_total_booking}</b> &euro; TTC</p> 
                    </>}
                </article>

                <MainBtn onClick={handleSaveBooking} className={styles.booking_btn} text="modifier la réservation"/>

                <div className={styles.error_ctn}>
                    {errors.map((el, i) => el[i] &&
                    <p key={i}>Erreur : {errors[i]}</p>)}
                </div>

            </section>}
        </main>
}

export default ModifyBooking;