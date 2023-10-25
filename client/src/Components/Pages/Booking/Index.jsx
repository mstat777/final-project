import styles from './booking.module.css';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
    setPacks, setHebergement, setActivites
 } from "../../../store/slices/travel";
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer } from 'react-leaflet';
import "leaflet/dist/leaflet.css";

function Booking(){
    const dispatch = useDispatch();
    let { id } = useParams();

    const { destination } = useSelector((state) => state.allTravel);

    const { packs } = useSelector((state) => state.allTravel);
    const { hebergement } = useSelector((state) => state.allTravel);
    const { activites } =  useSelector((state) => state.allTravel);

    const [coord, setCoord] = useState([0,0]);
    // récupérer et modifier les coordonnées de l'hébergement pour l'afficher dans la carte
    useEffect(() => {
        if(hebergement.coordonnees) {
            const tempArray = (hebergement.coordonnees).split(", ");
            //console.log("tempArray = "+tempArray);
            console.log("coord = "+coord);
            tempArray[0] = Math.round(tempArray[0] * 100000) / 100000;
            tempArray[1] = Math.round(tempArray[1] * 100000) / 100000;
            //console.log("coord[0] = "+coord[0]);
            //console.log("coord[1] = "+coord[1]);
            setCoord([tempArray[0],tempArray[1]]);
        }
    }, [hebergement]);

    return (
        <main id="booking">
            { (destination && hebergement && activites) &&
            <div className={styles.detail_section}>
                <img src={"../../img/hebergements/"+hebergement.url_image_initiale} alt="" />
                <h4>{hebergement.nom}</h4>
                <h3>{destination.nom}</h3>
    
                { console.log("id = "+id)}
                <div className={styles.pack_ctn}>
                    <span>{packs[id].date_depart.slice(0, packs[id].date_retour.indexOf('T'))}</span>
                    <span>{packs[id].date_retour.slice(0, packs[id].date_retour.indexOf('T'))}</span> 
                    <span>{packs[id].duree+1}J/{packs[id].duree}N</span>  
                    <span>{packs[id].prix_adulte}</span> 
                    <span>{packs[id].prix_enfant}</span> 
                </div>

                <p><span>Présentation</span>{hebergement.presentation}</p>
                <p><span>Equipement</span>{hebergement.equipement}</p>
                <p><span>Logement</span>{hebergement.logement}</p>
                <p><span>Restauration</span>{hebergement.restauration}</p>
                <p><span>Formules</span>{hebergement.formules}</p>
                <p><span>Loisirs</span>{hebergement.loisirs}</p>
                <p><span>Enfants</span>{hebergement.enfants}</p>
                <p>Tripadvisor : {hebergement.tripadvisor}</p>

                <div className={styles.activites_ctn}>
                    <span>Veuillez choisir entre les activités suivantes :</span>
                    {activites.map((activite, index) => 
                        <div className={styles.activite} key={index}>
                            <div>
                                <input type="checkbox" name={activite.id}/>
                                <label for={activite.id}>{activite.nom}</label>
                            </div>
                            <div>
                                <p>Type: {activite.type}</p>
                                <p>Prix: adultes: {activite.prix_adulte}&euro;, enfants: {activite.prix_enfant}&euro;</p>
                            </div> 
                            <p>{activite.description}</p>
                        </div>
                    )}
                </div>

                <MapContainer center={coord} zoom={15} scrollWheelZoom={false} className={styles.leaflet_container}>
                    <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                </MapContainer>
            </div>
            }
        </main>
    )
}

export default Booking;