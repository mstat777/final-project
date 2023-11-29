import styles from './card.module.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDestination, 
        fetchLodging, 
        fetchPacks } from '../../Functions/fetchData';
import { useSelector } from 'react-redux';
import { formatCoordinates } from '../../Functions/utils';

function Card({type, data}){
    const navigate = useNavigate();

    const { destination, lodging } = useSelector((state) => state.allTravel);
    
    //
    useEffect(() => {
        if (destination.lodging_id) {
            fetchLodging(destination.lodging_id);
            fetchPacks(destination.id);
        }
    },[destination]);

    // formatter les coordonnées de l'hébérgement :
    useEffect(() => {
        if (lodging !== undefined) {
            if (lodging.coordinates) {
                //console.log("lodging.coordinates = "+lodging.coordinates);
                formatCoordinates(lodging.coordinates);
            }  
        } 
    },[lodging]);

    // on passe le nom et l'ID de la destination
    async function handleClick(name, id){
        await fetchDestination(name);
        navigate(`/detail/${name}`);
    }

    if (type === "promo"){
        return <div className={styles.card_ctn}>
                    <img src={`../../img/destinations/${data.url_initial_image}`} alt=""/>
                    <div className={styles.card_info}> 
                        <h4>{data.country}</h4>
                        <h3>{data.name}</h3>
                        <p>A partir de :</p>
                        <button onClick={() => handleClick(data.name, data.id)} className={styles.discover_btn}>découvrir</button>
                    </div>
                </div>
    } else if (type === "topOffer"){
        return <div className={styles.card_ctn}>
                    <img src={`../../img/destinations/${data.url_initial_image}`} alt=""/>
                    <div className={styles.card_info}> 
                        <h4>{data.country}</h4>
                        <h3>{data.name}</h3>
                        <p>A partir de :</p>
                        <button onClick={() => handleClick(data.name, data.id)} className={styles.discover_btn}>découvrir</button>
                    </div>
                </div>
    }       
}

export default Card;