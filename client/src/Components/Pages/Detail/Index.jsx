import styles from './detail.module.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from "react-responsive";

/* --------- OpenStreetMap ------------- */
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
//import icon from 'leaflet/dist/images/marker-icon.png';
import icon from './img/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
// ------------------------------------- */

import tripadvisorLogo from '../../Containers/TripadvisorNote/img/tripadvisor-logo-50-32.png'

import { choosePack } from "../../../store/slices/user";  

import Slider from '../../Containers/Slider/Index';
import TripadvisorNote from '../../Containers/TripadvisorNote/Index';
import { fetchActivities } from '../../Functions/fetchData';
import { formatDate } from '../../Functions/utils';

import SeeMore from '../../Containers/SeeMore/Index';

function Detail(){
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { destination, 
            lodging, 
            packs, 
            activities, 
            coordinates } = useSelector((state) => state.allTravel);

    // ----- Corriger le bug d'Openstreetmap ------
    let DefaultIcon = L.icon({
        iconUrl: icon,
        shadowUrl: iconShadow,
        iconSize: [25,41],
        iconAnchor: [12.5,41]
    });
    L.Marker.prototype.options.icon = DefaultIcon;
    // --------------------------------------------

    // remonter au top de la page lors de chargement
    const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
    const isTabletOrDesktop = useMediaQuery({ query: '(min-width: 768px)' });
    useEffect(() => {
        if (isMobile) { window.scrollTo(0, 160); }
        if (isTabletOrDesktop) { window.scrollTo(0, 0); }
    }, [])

    // on récupère les données des activités liées à la destination :
    useEffect(() => {
        fetchActivities(destination.id);
    }, [destination]);

    return (
        <main id="detail">
            {/* console.log(packs) */}
            { (destination && lodging && activities) &&
            <div className={styles.detail_section}>
                {/*console.log("lodging = "+lodging)*/}
                <div className={styles.slider_ctn}>
                    <Slider type="lodging"/>
                </div>
                
                <h4>{lodging.name}</h4>
                <h3>{destination.name}</h3>
                <table className={styles.packs_table}>
                    <thead>
                        <tr> 
                            <th>date de départ</th> 
                            <th>date de retour</th>
                            <th>durée</th>
                            <th>prix/adulte</th>
                            <th>prix/enfant</th>
                            <th>réserver</th>
                        </tr>
                    </thead>
                    <tbody>      
                        { packs.map((pack, index) => 
                            <tr key={index}>
                                {/*console.log("index = "+index)*/}
                                <td><span>{formatDate(pack.departure_date)}</span></td>
                                <td><span>{formatDate(pack.return_date)}</span></td> 
                                <td><span>{pack.duration+1}</span>J / <span>{pack.duration}</span>N</td>  
                                <td><span>{Math.round(pack.price_adults)}</span> &euro;</td> 
                                <td><span>{Math.round(pack.price_children)}</span> &euro;</td> 
                                <td>
                                    <button 
                                    onClick={() => {
                                        dispatch(choosePack(index));
                                        //console.log("index of pack = "+index);
                                        navigate(`/booking/${index}`);
                                    }} 
                                    className={styles.book_btn}>réserver</button>
                                </td> 
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className={styles.property_ctn}>
                    <span>Présentation</span>
                    <SeeMore text={lodging.overview}/>
                </div>
                <div className={styles.property_ctn}>
                    <span>Equipement</span>
                    <SeeMore text={lodging.facilities}/>
                </div>
                <div className={styles.property_ctn}>      
                    <span>Logement</span>
                    <SeeMore text={lodging.rooms}/>
                </div>
                <div className={styles.property_ctn}>
                    <span>Restauration</span>
                    <SeeMore text={lodging.food_drink}/>
                </div>
                <div className={styles.property_ctn}>
                    <span>Formules</span>
                    <SeeMore text={lodging.meal_plans}/>
                </div>
                <div className={styles.property_ctn}>
                    <span>Loisirs</span>
                    <SeeMore text={lodging.entertainment}/>     
                </div>
                <div className={styles.property_ctn}>
                    <span>Enfants</span>
                    <SeeMore text={lodging.children}/>
                </div>
                <div className={styles.property_ctn}>
                    <span>Tripadvisor</span>
                    <div className={styles.tripadvisor_ctn}>
                        <img src={tripadvisorLogo} alt=""/>
                        <span className={styles.tripadvisor_txt}>{lodging.tripadvisor}</span>
                        <TripadvisorNote note={lodging.tripadvisor}/>
                    </div>
                </div>
                
                <div className={styles.activities_ctn}>
                    <span>Activités optionnelles</span>
                    <p>Au départ de votre {lodging.name}, vous pouvez profitez des activités suivantes :</p>
                    {/* console.log("activities = "+activities)*/}
                    {/* console.log("type of activities = "+typeof activities)*/}
                    {activities !== undefined &&
                    activities.map((activity, index) => 
                        <div className={styles.activity} key={index}>
                            <span>{activity.name}</span>
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