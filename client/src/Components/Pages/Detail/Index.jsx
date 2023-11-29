import styles from './detail.module.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
// - pour gérer le bug d'affichage du marker d'Openstreetmaps :
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
// ------------------------------------------------------------
import { formatCoordinates } from '../../Functions/utils.js';

import { choosePack } from "../../../store/slices/user";  

import Slider from '../../Containers/Slider/Index';
import TripadvisorNote from '../../Containers/TripadvisorNote/Index';
import { fetchActivities } from '../../Functions/fetchData';

function Detail(){
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { destination } = useSelector((state) => state.allTravel);

    const { lodging } = useSelector((state) => state.allTravel);
    const { packs } = useSelector((state) => state.allTravel);
    const { activities } = useSelector((state) => state.allTravel);
    const { coordinates } = useSelector((state) => state.allTravel);

    // ----- Corriger le bug d'Openstreetmap ------
    let DefaultIcon = L.icon({
        iconUrl: icon,
        shadowUrl: iconShadow
    });
    L.Marker.prototype.options.icon = DefaultIcon;
    // --------------------------------------------

    // remonter au top de la page lors de chargement
    useEffect(() => {
        document.getElementById("detail").scrollIntoView();
    }, [])

    // on récupère les données des activités liées à la destination :
    useEffect(() => {
        fetchActivities(destination.id);
    }, [destination]);
/*
    useEffect(() => {
        console.log("lodging.coordinates = "+lodging.coordinates);
        if (lodging.coordinates) {
            formatCoordinates(lodging.coordinates);
        }   
    }, [lodging.coordinates]);*/

    return (
        <main id="detail">
            { (destination && lodging && activities) &&
            <div className={styles.detail_section}>
                { console.log("lodging = "+lodging)}
                <Slider type="lodging"/>
                <h4>{lodging.name}</h4>
                <h3>{destination.name}</h3>
                <table className={styles.packs_table}>
                    <thead>
                        <tr> 
                            <th>date de départ</th> 
                            <th>date de retour</th>
                            <th>durée</th>
                            <th>prix/TTC/adulte</th>
                            <th>prix/TTC/enfant</th>
                            <th>réserver</th>
                        </tr>
                    </thead>
                    <tbody>      
                        { packs.map((pack, index) => 
                            <tr key={index}>
                                <td>{pack.departure_date.slice(0, pack.departure_date.indexOf('T'))}</td>
                                <td>{pack.return_date.slice(0, pack.return_date.indexOf('T'))}</td> 
                                <td>{pack.duration+1}J/{pack.duration}N</td>  
                                <td>{pack.price_adults} &euro;</td> 
                                <td>{pack.price_children} &euro;</td> 
                                <td>
                                    <button 
                                    onClick={() => {
                                        dispatch(choosePack(index));
                                        console.log("index of pack = "+index);
                                        navigate(`/booking/${index}`);
                                    }} 
                                    className={styles.book_btn}>réserver</button>
                                </td> 
                            </tr>
                        )}
                    </tbody>
                </table>
                <p><span>Présentation</span>{lodging.overview}</p>
                <p><span>Equipement</span>{lodging.facilities}</p>
                <p><span>Logement</span>{lodging.rooms}</p>
                <p><span>Restauration</span>{lodging.food_drink}</p>
                <p><span>Formules</span>{lodging.meal_plans}</p>
                <p><span>Loisirs</span>{lodging.entertainment}</p>
                <p><span>Enfants</span>{lodging.children}</p>
                <p>Tripadvisor : {lodging.tripadvisor}</p>
                <TripadvisorNote note={lodging.tripadvisor}/>
                
                <div className={styles.activities_ctn}>
                    <span>Activités optionnelles</span>
                    <p>Au départ de votre {lodging.name}, vous pouvez profitez des activités suivantes :</p>
                    { console.log("activities = "+activities)}
                    { console.log("type of activities = "+typeof activities)}
                    {activities != undefined &&
                    activities.map((activity, index) => 
                        <div className={styles.activity} key={index}>
                            <strong>{activity.name}</strong>
                            <div>
                                <p>Type: {activity.type}</p>
                                <p>Prix: adultes: {activity.price_adults}&euro;, enfants: {activity.price_children}&euro;</p>
                            </div> 
                            <p>{activity.overview}</p>
                        </div>
                    )
                    }       
                </div>

                { coordinates[0] &&
                <MapContainer center={coordinates} zoom={15} scrollWheelZoom={false} className={styles.leaflet_container}>
                    <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                    <Marker position={coordinates}>
                        <Popup>{lodging.name}</Popup>
                    </Marker>
                </MapContainer>
                }
            </div>
            }
        </main>
    )
}

export default Detail;