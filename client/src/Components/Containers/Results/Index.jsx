import styles from './results.module.css';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Slider from '../Slider/Index';
import { fetchPacks } from '../../Functions/fetchData'; 
import { cheapestPack } from '../../Functions/utils.js';

function Results() {
    const { destination } = useSelector((state) => state.allTravel);
    const { packs } = useSelector((state) => state.allTravel);
    const { destinationImages } = useSelector((state) => state.allTravel);

    useEffect(() => {
        // on récupère les données des packs liées à la destination :
        fetchPacks(destination.id);
    }, []);

    return (
        <section id="resultsContainer" className={styles.results_section}>
            <article>

                <div className={styles.slider_ctn}>
                    {destinationImages[0] && 
                    <Slider type="destination"/>}
                </div>
    
                <div>
                    <h3>{destination.name}</h3>
                    <h4>{destination.country}</h4>
                    <p className={styles.justify}>{destination.overview}</p>
                    <p>dès <span className={styles.price}>{packs[0] && cheapestPack(packs)}&euro;</span> TTC/adulte</p>
                    <Link to={`/detail/${destination.name}`} className={styles.discover_btn}>découvrir</Link>
                </div>

            </article>
        </section>
    )
}

export default Results;