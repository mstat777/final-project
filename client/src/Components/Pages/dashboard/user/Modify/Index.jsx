import styles from '../../../Booking/booking.module.css';
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

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faCircleMinus } from '@fortawesome/free-solid-svg-icons';

function ModifyBooking(){
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const IMG_URL = process.env.REACT_APP_IMG_URL;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    //const [ isNbPeopleLoaded, setIsNbPeopleLoaded ] = useState(false);
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

    // stocker les données de l'ancienne réservation :
    const { bookedData } = useSelector((state) => state.booking);
    // stocker les données de la nouvelle réservation :
    const { bookingInfo } = useSelector((state) => state.booking);

    const { userInfo } = useSelector((state) => state.user);
    // on récupère l'ID du pack sélectionné :
    const packID = userInfo.modifPackID;
    // sélectionner le 1er pack suite à la fetch :
    const id = 0;

    const { destination, lodging, packs, activities } = useSelector((state) => state.allTravel);

    // initialiser les variables pour stocker les prix du pack et des activités associées :
    const [pricesList, setPricesList] = useState({
        price_adults_pack: 0,
        price_children_pack: 0,
        price_adults_activities: [],
        price_children_activities: []
    });
    
    // on récupère toutes les données liées au pack lors du 1er chargement de la page :
    useEffect(() => {
        async function fetchPackAllData(){
            try {
                const dataAll = await (await fetch(`${BASE_URL}/api/v.0.1/travel/pack-all-data/${packID}`)).json();
                //console.log(dataAll);
                dispatch(setDestination(dataAll.datasDest[0]));
                dispatch(setPacks(dataAll.datasPacks));
                dispatch(setLodging(dataAll.datasLodg[0]));
                dispatch(setActivities(dataAll.datasAct));
                console.log("fetch all data called");
            } catch (error) {
                console.log(error);
            }
        }
        fetchPackAllData();
    },[]);
    
    // pour récupérer les NOMBRES DE PERSONNES pour chaque activité et le pack :
    useEffect(() => {
        if (destination && lodging && packs[0] && activities[0]){      
            const adultsBookedAct = [];
            const childrenBookedAct = [];
            for (let i = 0; i < activities.length; i++) {
                adultsBookedAct.push(0);
                childrenBookedAct.push(0);
            }
            console.log(bookedData);
            //console.log("activities.length = "+activities.length);
            //console.log("bookedData.datasBookAct.length = "+bookedData.datasBookAct.length);
            for (let i = 0; i < activities.length; i++) {
                //console.log("activities[i].id = "+activities[i].id);
                for (let j = 0; j < bookedData.datasBookAct.length; j++) {
                    if (bookedData.datasBookAct[j].activity_id === activities[i].id) {
                        //console.log("bookedData.datasBookAct[j].activity_id = "+bookedData.datasBookAct[j].activity_id);
                        adultsBookedAct[i] = bookedData.datasBookAct[j].nb_adults;
                        childrenBookedAct[i] = bookedData.datasBookAct[j].nb_children;
                    } 
                }
                //console.log(adultsBookedAct);
            }

            // et on les enregistre dans Store :
            const numberPeople = {
                nb_adults: {
                    pack: bookedData.datasBook[0].nb_adults,
                    activities: adultsBookedAct
                },
                nb_children: {
                    pack: bookedData.datasBook[0].nb_children,
                    activities: childrenBookedAct
                }
            }
            //console.log(numberPeople);
            dispatch(setNbInBooking(numberPeople));
            //setIsNbPeopleLoaded(true);
            console.log("getting people nb");
        }
    },[destination, lodging, packs[0], activities[0]]);

    // si on a les nb de personnes -> on récupère LES PRIX PAR PERSONNE (pack & activités), les formatte et les stocke dans le Store (pour pouvoir les afficher):
    useEffect(() => {  
        if (bookingInfo.nb_adults.pack) {
            console.log("je calcule les prix");
            //console.log(destination, lodging, packs, activities);
            // initialiser les checkboxes :
            let myArray = []; 
            activities.forEach(() => {
                myArray.push(true);
            });
            setCheckBoxes(myArray);
            
            // des variables pour stocker tous les prix (du pack et des activités) qu'on va récupèrer de la BDD, les regroupe en arrays pour les passer au Store :
            let prices_adults = [];
            let prices_children = [];
            for (let i = 0; i < activities.length; i++) {
                prices_adults[i] = activities[i].price_adults;
                prices_children[i] = activities[i].price_children;
                console.log("activities[i].price_children = "+activities[i].price_children);
            }
            
            setPricesList({
                price_adults_pack: packs[id].price_adults,
                price_children_pack: packs[id].price_children,
                // on a récupéré les prix de toutes les activités ci-dessus
                price_adults_activities: prices_adults,
                price_children_activities: prices_children
            });
        }
    },[bookingInfo.nb_adults.pack]);

    // si toutes les données sont chargées, on peut afficher la page :
    useEffect(() => {
        if (bookingInfo.prices.total_all) {
            setIsAllDataLoaded(true);
            console.log('isAllDataLoaded = '+isAllDataLoaded);
        }
    },[bookingInfo.prices.total_all]);

    // CALCULER LES PRIX TOTAUX chaque fois le nb de personnes change :
    useEffect(() => {
        console.log("je vérifie si peux calculer les prix");
        console.log("bookingInfo.nb_adults.pack = "+bookingInfo.nb_adults.pack);
        console.log("pricesList.price_adults_activities.length = "+pricesList.price_adults_activities.length);
        if (bookingInfo.nb_adults.pack && 
            pricesList.price_adults_activities.length) {
            dispatch(calculatePrices(pricesList));
            console.log('prix calculés');
        }
    },[bookingInfo.nb_adults, bookingInfo.nb_children, pricesList.price_adults_activities.length]);

    // afficher/cacher (via checkbox) les compteurs pour les activités :
    function handleChange(index) {
        const newArray = [...checkBoxes];
        newArray[index] = !checkBoxes[index];
        //console.log("newArray[index] = "+newArray[index]);
        //console.log(newArray);
        setCheckBoxes(newArray);
    }

    // vérifier la réservation grâce à la fonction verifyBooking et passer à la page Booking Modified Summary, si OK :
    function handleSaveBooking(){
        setErrors(verifyBooking());
        // si aucune erreur trouvée, passe à la page Summary :
        if (errors.every(el => el === false)) {
            navigate(`/db/user/booking-summary`);
        }
    }

    return <main id="booking-modify">
            {/* (destination && lodging && packs[0] && activities[0] && bookingInfo.nb_adults.pack && bookingInfo.prices.total_all) ?*/}
            {isAllDataLoaded ?
            <div className={styles.booking_section}>
                {/* console.log(bookingInfo)*/}
                {/* console.log(bookingInfo.nb_adults)*/}
                <h2>modifier votre réservation</h2>
                <div className={styles.booking_info_top}>
                    <div className={styles.booking_info_ctn}>
                        <h4>{lodging.name}</h4>
                        <h3>{destination.name}</h3>
                        <p>Paramètres du pack :</p>
                        <p>Date de départ : <span>{packs[id].departure_date.slice(0, packs[id].departure_date.indexOf('T'))}</span></p>
                        <p>Date de retour : <span>{packs[id].return_date.slice(0, packs[id].return_date.indexOf('T'))}</span></p> 
                        <p>Durée : <span>{packs[id].duration+1}</span> jours / <span>{packs[id].duration}</span> nuits</p>  
                        <p>Prix/TTC/adulte : <span>{packs[id].price_adults}</span> &euro;</p> 
                        <p>Prix/TTC/enfant : <span>{packs[id].price_children}</span> &euro;</p> 
                    </div>
                    <img src={`${IMG_URL}/img/lodgings/${lodging.url_initial_image}`} alt="" className={styles.main_img}/>
                </div>

                <p>Nombre d'adultes et d'enfants pour lesquels vous avez réservé :</p>
                <div className={styles.booking_inputs_ctn}>
                    <div className={styles.booking_inputs}>
                        <span>Adultes :</span>
                        <button onClick={()=>{dispatch(incrNbAdultsPack())}}>
                            <FontAwesomeIcon icon={faCirclePlus} className={styles.fa_circle}/>
                        </button>
                        <input type="text" 
                            pattern="[0-9]{2}"
                            value={bookingInfo.nb_adults.pack}
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
                            value={bookingInfo.nb_children.pack}
                            disabled/>
                        <button onClick={()=>{dispatch(decrNbChildrenPack())}}>
                            <FontAwesomeIcon icon={faCircleMinus} className={styles.fa_circle}/>
                        </button>
                    </div>
                </div>

                <div className={styles.booking_activities_ctn}>
                    <span>Activités à réserver :</span>
                    {activities.map((activity, index) => 
                        <div className={styles.booking_activity} key={index}>
                            <div className={styles.booking_activity_title}>
                                <label htmlFor={activity.id}>
                                    <input type="checkbox" 
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
                <div className={styles.booking_totals_ctn}>
                    <p>Prix total du pack : <span>{bookingInfo.prices.total_pack}</span> &euro; TTC</p> 
                    <p>Prix total des activités choisies : <span>{bookingInfo.prices.total_activities}</span> &euro; TTC</p> 
                    <p>Prix total (pack + activités) : <span>{bookingInfo.prices.total_all}</span> &euro; TTC</p> 

                    {/* si l'utilisateur a déjà payé : */}
                    {bookedData.datasBook[0].status === "validée" ? <>
                        <p>Montant déjà payé : <span>{parseFloat(bookedData.datasBook[0].price_total_booking)}</span> &euro; TTC</p> 
                        <p>RESTE A PAYER : <span>{bookingInfo.prices.total_all - bookedData.datasBook[0].price_total_booking}</span> &euro; TTC</p> 
                    </> : null}

                </div>

                <button onClick={handleSaveBooking} className={styles.booking_btn}>modifier la réservation</button>

                <div className={styles.error_ctn}>
                    {errors.map((el, idx) => el[idx] &&
                    <p>Erreur : {errors[idx]}</p>)}
                </div>

            </div> 
            : null}
        </main>
}

export default ModifyBooking;