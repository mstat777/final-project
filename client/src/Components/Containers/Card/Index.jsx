import styles from './card.module.css';
import { useNavigate } from 'react-router-dom';
import { fetchDestination, fetchPacks } from '../../Functions/fetchData';

function Card({type, data}){
    const navigate = useNavigate();

    // on passe le nom et l'ID de la destination
    async function handleClick(name, id){
        await fetchDestination(name);
        await fetchPacks(id);
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
                        <button onClick={() => handleClick(data.name)} className={styles.discover_btn}>découvrir</button>
                    </div>
                </div>
    }       
}

export default Card;