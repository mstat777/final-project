import styles from './card.module.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDestinationAllPacks } from '../../Functions/fetchData';
import { useSelector } from 'react-redux';

function Card({type, data}){
    const IMG_URL = process.env.REACT_APP_IMG_URL;
    const navigate = useNavigate();

    const { destination } = useSelector((state) => state.allTravel);

    // on passe le nom et l'ID de la destination
    async function handleClick(name){
        await fetchDestinationAllPacks(name);
        navigate(`/detail/${name}`);
    }

    if (type === "promo"){

        return <div className={styles.card}>
                    <img src={`${IMG_URL}/img/destinations/${data.url_initial_image}`} alt=""/>
                    <div className={styles.card_info}> 
                        <h4>{data.country}</h4>
                        <h3>{data.name}</h3>
                        <div className={styles.price_percent_ctn}>
                            <div className={styles.percent_ctn}>
                                <span>-{data.max_discount}</span><sup>%</sup>
                            </div>
                            <div className={styles.price_ctn}>
                                à partir de <span>{data.price_adults.slice(0,data.price_adults.lastIndexOf('.'))}</span><sup>&euro;</sup>
                            </div> 
                        </div>
                        <button
                            onClick={() => handleClick(data.name)}          
                            className={styles.discover_btn}>découvrir</button>
                    </div>
                </div>

    } else if (type === "topOffer"){

        return <div className={styles.card}>
                    <img src={`../../img/destinations/${data.url_initial_image}`} alt=""/>
                    <div className={styles.card_info}> 
                        <h4>{data.country}</h4>
                        <h3>{data.name}</h3>
                        <div className={styles.price_percent_ctn}>
                            <div className={styles.price_ctn}>
                                à partir de <span>{data.price_adults.slice(0,data.price_adults.lastIndexOf('.'))}</span><sup>&euro;</sup>
                            </div> 
                        </div>
                        <button 
                            onClick={() => handleClick(data.name)} 
                            className={styles.discover_btn}>découvrir</button>
                    </div>
                </div>
    }       
}

export default Card;