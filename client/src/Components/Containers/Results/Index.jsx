import styles from './Results.module.scss';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useMediaQuery } from "react-responsive";
import Loading from '../Loading/Index';
import Slideshow from '../Slideshow/Index';
import { cheapestPack } from '../../Functions/utils.js';

function Results() {
    const { destination } = useSelector((state) => state.allTravel);
    const { packs } = useSelector((state) => state.allTravel);
    const { destinationImages } = useSelector((state) => state.allTravel);

    const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
    const isTabletOrDesktop = useMediaQuery({ query: '(min-width: 768px)' });

    useEffect(() => {
        if (isMobile) { window.scrollTo(0, 160); }
        if (isTabletOrDesktop) { window.scrollTo(0, 200); }
    }, [destination]);

    return (!destination && !packs[0] && !destinationImages[0]) ? 
            <Loading/> : 
            <section id="resultsContainer" className={styles.results_section}>
                <h2>Résultat de la recherche</h2>
                <article>
                    <div className={styles.slideshow_ctn}>
                        {destinationImages[0] && 
                        <Slideshow type="destination"/>}
                    </div>
        
                    <div>
                        <h3>{destination.name}</h3>
                        <p className={styles.country_txt}>{destination.country}</p>
                        <p className={styles.overview}>{destination.overview}</p>
                        <p>dès <span className={styles.price}>{packs[0] && cheapestPack(packs)}&euro;</span> TTC/adulte</p>
                        <Link to={`/detail/${destination.name}`} className={styles.discover_btn}>découvrir</Link>
                    </div>
                </article>
            </section>
}

export default Results;