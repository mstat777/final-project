import styles from './Card.module.scss';
import { useNavigate } from 'react-router-dom';
import { fetchDestinationAllPacks } from '../../Functions/fetchData';
import MainBtn from '../buttons/MainBtn/Index';

function Card({type, data}){
    const IMG_URL = process.env.REACT_APP_IMG_URL;
    const navigate = useNavigate();

    // on passe le nom et l'ID de la destination
    async function handleClick(name){
        await fetchDestinationAllPacks(name);
        navigate(`/detail/${name}`);
    }

    return <article className={styles.card}>
                <img src={`${IMG_URL}/img/destinations/${data.url_initial_image}`} alt="la destination"/>

                <div className={styles.card_info}> 
                    <h4>{data.country}</h4>
                    <h3>{data.name}</h3>
                    <div className={`${styles.price_percent_ctn} ${type !== "promo" ? styles.center : null}`}>

                        { type === "promo" &&
                        <div className={styles.percent_ctn}>
                            <span>-{data.max_discount}</span><sup>%</sup>
                        </div>}

                        <div className={styles.price_ctn}>
                            <span>à partir de</span>

                            <span className={styles.price_txt}>
                                {data.price_adults.slice(0,data.price_adults.lastIndexOf('.'))}
                                <sup>&euro;</sup>
                            </span>
                        </div>

                    </div>
                    <MainBtn
                        onClick={() => handleClick(data.name)}          
                        text="découvrir"/>
                </div>
            </article>    
}

export default Card;