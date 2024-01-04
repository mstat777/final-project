import styles from './Detail.module.scss';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from "react-responsive";

/* --------- OpenStreetMap ------------- */
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import icon from './img/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

import tripadvisorLogo from '../../Containers/TripadvisorNote/img/tripadvisor-logo-50-32.png'

import { choosePack } from "../../../store/slices/user";  

import Slideshow from '../../Containers/Slideshow/Index';
import TripadvisorNote from '../../Containers/TripadvisorNote/Index';
import { fetchActivities } from '../../Functions/fetchData';
import { formatDate } from '../../Functions/utils';

import SeeMore from '../../Containers/SeeMore/Index';
import MainBtn from '../../Containers/buttons/MainBtn/Index';

function Detail(){
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { destination, 
            lodging, 
            packs, 
            activities, 
            coordinates } = useSelector((state) => state.allTravel);

    // ----- Openstreetmap ------
    let DefaultIcon = L.icon({
        iconUrl: icon,
        shadowUrl: iconShadow,
        iconSize: [25,41],
        iconAnchor: [12.5,41]
    });
    L.Marker.prototype.options.icon = DefaultIcon;

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

    return <main id="detail">

            { (destination && lodging && activities) &&
            <section className={styles.detail_section}>
                <h1>Informations détaillées de la destination choisie</h1>

                <div className={styles.slideshow_ctn}>
                    <Slideshow type="lodging"/>
                </div>
                
                <section className={styles.lodging_title}>
                    <h2>{lodging.name}</h2>
                    <p>{destination.name}</p>
                </section>
                
                <section className={styles.packs_main_ctn}>
                    <h2>Sélectionner un pack</h2>
                    { packs.map((pack, index) => 
                    <article key={index} className={styles.pack_ctn}>
                        <div>
                            <span>{!isMobile && "date de "} départ :</span> 
                            <span>{formatDate(pack.departure_date)}</span>
                        </div>
                        <div className={styles.pack_el_adult_pr}>
                            <span>p{!isMobile && "rix"}/adulte :</span>
                            <span className={styles.price_txt}>{Math.round(pack.price_adults)}</span>&euro;
                        </div> 
                        <div>
                            <span>{!isMobile && "date de "} retour :</span>
                            <span>{formatDate(pack.return_date)}</span>
                        </div> 
                        <div className={styles.pack_el_children_pr}>
                            <span>p{!isMobile && "rix"}/enfant :</span>
                            <span className={styles.price_txt}>{Math.round(pack.price_children)}</span>&euro;
                        </div> 
                        <div>
                            <span>durée :</span>
                            <span>{pack.duration+1}</span>J / <span>{pack.duration}</span>N
                        </div>  
                        <div>
                            <MainBtn 
                                onClick={() => {
                                    dispatch(choosePack(index));
                                    navigate(`/booking/${index}`);
                                }} 
                                className={styles.book_btn} text="réserver"/>
                        </div> 
                    </article>
                    )}
                </section>

                <section>
                    <h2 className={styles.hidden}>Hébergement</h2>
                    <article className={styles.property_ctn}>
                        <h3>Présentation</h3>
                        <SeeMore text={lodging.overview}/>
                    </article>
                    <article className={styles.property_ctn}>
                        <h3>Equipement</h3>
                        <SeeMore text={lodging.facilities}/>
                    </article>
                    <article className={styles.property_ctn}>      
                        <h3>Logement</h3>
                        <SeeMore text={lodging.rooms}/>
                    </article>
                    <article className={styles.property_ctn}>
                        <h3>Restauration</h3>
                        <SeeMore text={lodging.food_drink}/>
                    </article>
                    <article className={styles.property_ctn}>
                        <h3>Formules</h3>
                        <SeeMore text={lodging.meal_plans}/>
                    </article>
                    <article className={styles.property_ctn}>
                        <h3>Loisirs</h3>
                        <SeeMore text={lodging.entertainment}/>     
                    </article>
                    <article className={styles.property_ctn}>
                        <h3>Enfants</h3>
                        <SeeMore text={lodging.children}/>
                    </article>
                    <article className={styles.property_ctn}>
                        <h3>Tripadvisor</h3>
                        <div className={styles.tripadvisor_ctn}>
                            <img src={tripadvisorLogo} alt="logo de Tripadvisor"/>
                            <span className={styles.tripadvisor_txt}>{lodging.tripadvisor}</span>
                            <TripadvisorNote note={lodging.tripadvisor}/>
                        </div>
                    </article>
                </section>
                
                <section className={styles.activities_ctn}>
                    <h2>Activités optionnelles</h2>
                    <p>Au départ de votre {lodging.name}, vous pouvez profitez des activités suivantes :</p>
 
                    {activities.map((activity, index) => 
                        <article className={styles.activity} key={index}>
                            <h3>{activity.name}</h3>
                            <div>
                                <p>Type: {activity.type}</p>
                                <p>Prix: adultes: {activity.price_adults}&euro;, enfants: {activity.price_children}&euro;</p>
                            </div> 
                            <p>{activity.overview}</p>
                        </article>
                    )}       
                </section>

                {coordinates[0] &&
                <MapContainer center={coordinates} zoom={15} scrollWheelZoom={false} className={styles.leaflet_container}>
                    <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                    <Marker position={coordinates}>
                        <Popup>{lodging.name}</Popup>
                    </Marker>
                </MapContainer>
                }
            </section>
            }
        </main>
}

export default Detail;