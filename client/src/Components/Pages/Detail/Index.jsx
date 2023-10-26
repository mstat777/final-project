import styles from './detail.module.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    setPacks, setHebergement, setActivites
 } from "../../../store/slices/travel";
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer } from 'react-leaflet';
import "leaflet/dist/leaflet.css";

function Detail(){
    const dispatch = useDispatch();

    const { destination } = useSelector((state) => state.allTravel);

    const { packs } = useSelector((state) => state.allTravel);
    const { hebergement } = useSelector((state) => state.allTravel);
    const { activites } =  useSelector((state) => state.allTravel);

    const [coord, setCoord] = useState([0,0]);

    useEffect(() => {
        // on récupère les données des packs liées à la destination :
        async function fetchPacks() {
            try {
                const dataPack = await (await fetch(`/api/v.0.1/travel/pack/${destination.id}`)).json();
                console.log("des packs ont été trouvés dans la BD");
                localStorage.setItem("packs", JSON.stringify(dataPack.datas));
                dispatch(setPacks(dataPack.datas));  
            } catch (error) {
                console.log(error);
            }
        }
        fetchPacks();
    }, []);

    useEffect(() => {
        // on récupère les données de l'hébérgement lié à la destination :
        async function fetchHebergement() {
            try {
                const dataHeb = await (await fetch(`/api/v.0.1/travel/hebergement/${destination.hebergement_id}`)).json();
                localStorage.setItem("hebergement", JSON.stringify(dataHeb.datas[0]));
                dispatch(setHebergement(dataHeb.datas[0]));
            } catch (error) {
                console.log(error);
            }
        }
        fetchHebergement();
    }, []);

    useEffect(() => {
        // on récupère les données des activités liées à la destination :
        async function fetchActivites() {
            try {
                const result = await (await fetch(`/api/v.0.1/travel/activities/${destination.id}`)).json();
                localStorage.setItem("activites", JSON.stringify(result.datas));
                dispatch(setActivites(result.datas));
            } catch (error) {
                console.log(error);
            }
        }
        fetchActivites();
    }, []);

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
        <main id="detail">
            { (destination && hebergement && activites) &&
            <div className={styles.detail_section}>
                { console.log("hebergement = "+hebergement)}
                <img src={"../../img/hebergements/"+hebergement.url_image_initiale} alt="" />
                <h4>{hebergement.nom}</h4>
                <h3>{destination.nom}</h3>
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
                                <td>{pack.date_depart.slice(0, pack.date_retour.indexOf('T'))}</td>
                                <td>{pack.date_retour.slice(0, pack.date_retour.indexOf('T'))}</td> 
                                <td>{pack.duree+1}J/{pack.duree}N</td>  
                                <td>{pack.prix_adulte}</td> 
                                <td>{pack.prix_enfant}</td> 
                                <td>
                                    <Link to={`/booking/${index}`}>Réserver</Link>
                                </td> 
                            </tr>
                        )}
                    </tbody>
                </table>
                <p><span>Présentation</span>{hebergement.presentation}</p>
                <p><span>Equipement</span>{hebergement.equipement}</p>
                <p><span>Logement</span>{hebergement.logement}</p>
                <p><span>Restauration</span>{hebergement.restauration}</p>
                <p><span>Formules</span>{hebergement.formules}</p>
                <p><span>Loisirs</span>{hebergement.loisirs}</p>
                <p><span>Enfants</span>{hebergement.enfants}</p>
                <p>Tripadvisor : {hebergement.tripadvisor}</p>

                <div className={styles.activites_ctn}>
                    <span>Au départ de votre {hebergement.nom}, vous pouvez profitez des activités suivantes :</span>
                    { console.log("activites = "+activites)}
                    { console.log("type de activites = "+typeof activites)}
                    {activites != undefined &&
                    activites.map((activite, index) => 
                        <div className={styles.activite} key={index}>
                            <strong>{activite.nom}</strong>
                            <div>
                                <p>Type: {activite.type}</p>
                                <p>Prix: adultes: {activite.prix_adulte}&euro;, enfants: {activite.prix_enfant}&euro;</p>
                            </div> 
                            <p>{activite.description}</p>
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