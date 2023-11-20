import styles from '../Containers/Search/search.module.css';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Slider from '../Containers/Slider/Index';
import { fetchPacks } from './fetchData'; 
import { cheapestPack } from '../Functions/utils.js';

function ShowResults() {
    const dispatch = useDispatch();

    const { destination } = useSelector((state) => state.allTravel);
    const { packs } = useSelector((state) => state.allTravel);
    const { destinationImages } = useSelector((state) => state.allTravel);

    useEffect(() => {
        // on récupère les données des packs liées à la destination :
        fetchPacks();
    }, []);

    return (
        <article>
            {console.log(destinationImages)}
            {destinationImages[0] ? <Slider type="destination"/> : <p></p>}
            <h3>{destination.name}</h3>
            <p>Pays : {destination.country}</p>
            <p><i>Réf. : {destination.reference}</i></p>
            <p>Info : {destination.overview}</p>
            <p>dès {cheapestPack(packs)}&euro; TTC/adulte</p>
            <Link to={`/detail/${destination.name}`} className={styles.discover_btn}>découvrir</Link>
        </article>
    )
}

export default ShowResults;