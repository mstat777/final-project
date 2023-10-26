import styles from './booking.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from "../../../store/slices/cart";
import { calculatePrices,
        setActivites, 
        increaseNumberAdultsPack, 
        decreaseNumberAdultsPack, 
        increaseNumberChildrenPack,
        decreaseNumberChildrenPack,
        increaseNumberAdultsActivite, 
        decreaseNumberAdultsActivite
    } from "../../../store/slices/booking";

function Booking(){
    const navigate = useNavigate();
    const dispatch = useDispatch();

    let { id } = useParams();

    const { destination } = useSelector((state) => state.allTravel);
    
    const { packs } = useSelector((state) => state.allTravel);
    const { hebergement } = useSelector((state) => state.allTravel);
    const { activites } =  useSelector((state) => state.allTravel);

    // stocker les données de la réservation :
    const { bookingInfo } = useSelector((state) => state.booking);

    // modifier les compteurs (nb d'enfants, nb d'adultes)
    /*function incrNbAdultes(index){
        if (!activite[index].nb_adults) {
            activite[index].nb_adults
        }
        console.log("nb_adults_act[0] = "+nb_adults_act[index]);
    }
    function decrNbAdultes(index){
        nb_adults_act[index]--;
    }
    function incrNbChildren(index){
        nb_children_act[index]++;
    }
    function decrNbChildren(index){
        nb_children_act[index]--;
    }*/

    useEffect(() => {
        dispatch(setActivites(activites.length));
        //console.log("activites.length = "+activites.length);
    }, [])

    useEffect(() => {
        const tempObject = {
            prix_adulte: packs[id].prix_adulte,
            prix_enfant: packs[id].prix_enfant,
        }
        dispatch(calculatePrices(tempObject));
        console.log("packs[id].prix_adulte = "+packs[id].prix_adulte);
        console.log("bookingInfo.prices.total_pack = "+bookingInfo.prices.total_pack);
        console.log("bookingInfo.nb_adults.pack = "+bookingInfo.nb_adults.pack);
    })

    async function handleOnClick() {
        navigate("/summary/:id")
    }

    return (
        <main id="booking">
            { (destination && hebergement && activites) &&
            <div className={styles.booking_section}>
                <img src={"../../img/hebergements/"+hebergement.url_image_initiale} alt="" />
                <h4>{hebergement.nom}</h4>
                <h3>{destination.nom}</h3>
    
                <p>Vous avez sélectionné le pack suivant :</p>
                <div className={styles.booking_pack_ctn}>
                    <p>Date de départ : <span>{packs[id].date_depart.slice(0, packs[id].date_retour.indexOf('T'))}</span></p>
                    <p>Date de retour : <span>{packs[id].date_retour.slice(0, packs[id].date_retour.indexOf('T'))}</span></p> 
                    <p>Durée : <span>{packs[id].duree+1}</span> jours / <span>{packs[id].duree}</span> nuits</p>  
                    <p>Prix/TTC/adulte : {packs[id].prix_adulte} &euro;</p> 
                    <p>Prix/TTC/enfant : {packs[id].prix_enfant} &euro;</p> 
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

                <div className={styles.booking_activites_ctn}>
                    <span>Veuillez choisir entre les activités suivantes :</span>
                    {activites.map((activite, index) => 
                        <div className={styles.booking_activite} key={index}>
                            <div className={styles.booking_activite_title} >
                                <input type="checkbox" name={activite.id}/>
                                <label for={activite.id}>{activite.nom}</label>
                            </div>
                            <div className={styles.booking_activite_inputs}>
                                <span>Adultes : </span>
                                <button onClick={()=>{dispatch(increaseNumberAdultsActivite(index))}}>+</button>
                                <input type="number" value={bookingInfo.nb_adults.activites[index]} />
                                <button onClick={()=>{dispatch(decreaseNumberAdultsActivite(index))}}>-</button>
                            </div>
                            <div>
                                <p>Type: {activite.type}</p>
                                <p>Prix: adultes: {activite.prix_adulte}&euro;, enfants: {activite.prix_enfant}&euro;</p>
                            </div> 
                            <p>{activite.description}</p>
                        </div>
                    )}
                </div>

                <p>Vous avez sélectionné le pack suivant :</p>
                <div className={styles.booking_pack_ctn}>
                    <p>Prix total du pack : <span>{bookingInfo.prices.total_pack}</span> &euro; TTC</p> 
                    <p>Prix total des activités choisies : <span>{bookingInfo.prices.total_pack}</span> &euro; TTC</p> 
                    <p>PRIX TOTAL A PAYER : <span>{bookingInfo.prices.total_pack}</span> &euro; TTC</p> 
                </div>

                <button onClick={handleOnClick} className={styles.booking_btn}>reserver</button>
            </div>
            }
        </main>
    )
}

export default Booking;