import styles from './detail.module.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer } from 'react-leaflet';
import "leaflet/dist/leaflet.css";

import { choosePack } from "../../../store/slices/user";  

import Slider from '../../Containers/Slider/Index';
import TripadvisorNote from '../../Containers/TripadvisorNote/Index';
import { fetchLodging, fetchActivities } from '../../Functions/fetchData';

function Detail(){
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { destination } = useSelector((state) => state.allTravel);

    const { lodging } = useSelector((state) => state.allTravel);
    const { packs } = useSelector((state) => state.allTravel);
    const { activities } =  useSelector((state) => state.allTravel);

    const [coord, setCoord] = useState([0,0]);

    // remonter au top de la page lors de chargement
    useEffect(() => {
        document.getElementById("detail").scrollIntoView();
    }, [])

    // on récupère les données de l'hébérgement lié à la destination :
    useEffect(() => {
        fetchLodging(destination.lodging_id);
    }, []);

    // on récupère les données des activités liées à la destination :
    useEffect(() => {
        fetchActivities(destination.id);
    }, []);

    // récupérer et modifier les coordonnées de l'hébergement pour l'afficher dans la carte
    useEffect(() => {
        if(lodging.coordinates) {
            const tempArray = (lodging.coordinates).split(", ");
            //console.log("tempArray = "+tempArray);
            console.log("coord = "+coord);
            tempArray[0] = Math.round(tempArray[0] * 100000) / 100000;
            tempArray[1] = Math.round(tempArray[1] * 100000) / 100000;
            //console.log("coord[0] = "+coord[0]);
            //console.log("coord[1] = "+coord[1]);
            setCoord([tempArray[0],tempArray[1]]);
            console.log("coord = "+coord);
        }
    }, [lodging]);

    return (
        <main id="detail">
            { (destination && lodging && activities) &&
            <div className={styles.detail_section}>
                { console.log("lodging = "+lodging)}
                <Slider type="lodging"/>
                <h4>{lodging.name}</h4>
                <h3>{destination.name}</h3>
                <table className={styles.packs_div}>
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
                                <td>{pack.price_adults}</td> 
                                <td>{pack.price_children}</td> 
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

                <MapContainer center={coord} zoom={15} scrollWheelZoom={false} className={styles.leaflet_container}>
                    <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                </MapContainer>
            </div>
            }
        </main>
    )
}

export default Detail;