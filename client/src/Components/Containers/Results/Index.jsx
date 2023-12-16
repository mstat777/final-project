import styles from './results.module.css';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import Loading from '../Loading/Index';
import Slider from '../Slider/Index';
import { cheapestPack } from '../../Functions/utils.js';

function Results() {
    const { pathname } = useLocation();

    const { destination } = useSelector((state) => state.allTravel);
    const { packs } = useSelector((state) => state.allTravel);
    const { destinationImages } = useSelector((state) => state.allTravel);

    const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
    const isTabletOrDesktop = useMediaQuery({ query: '(min-width: 768px)' });

    // remonter au top de la page lors de chargement
    useEffect(() => {
        //console.log("pathname.slice(1) = "+pathname.slice(1));
        //console.log("isMobile = "+isMobile);
        //console.log("isTablet = "+isTabletOrDesktop);

        if (isMobile) { window.scrollTo(0, 160); }
        if (isTabletOrDesktop) { window.scrollTo(0, 200); }
    }, [destination]);

    return <>
        {(!destination && !packs[0] && !destinationImages[0]) ? 
            <Loading /> : 
        <section id="resultsContainer" className={styles.results_section}>
            {/*console.log("destination.name = "+destination.name)*/}
            {/*console.log(packs)*/}
            <article>
                <div className={styles.slider_ctn}>
                    {destinationImages[0] && 
                    <Slider type="destination"/>}
                </div>
    
                <div>
                    <h3>{destination.name}</h3>
                    <h4>{destination.country}</h4>
                    <p className={styles.overview}>{destination.overview}</p>
                    <p>dès <span className={styles.price}>{packs[0] && cheapestPack(packs)}&euro;</span> TTC/adulte</p>
                    <Link to={`/detail/${destination.name}`} className={styles.discover_btn}>découvrir</Link>
                </div>

            </article>
        </section>}
    </>
}

export default Results;