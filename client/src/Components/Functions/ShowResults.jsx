import styles from '../Containers/Search/search.module.css';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Slider from '../Containers/Slider/Index';
import { setPacks } from "../../store/slices/travel";

function ShowResults() {
    const dispatch = useDispatch();

    const { destination } = useSelector((state) => state.allTravel);
    const { packs } = useSelector((state) => state.allTravel);
    const { destinationImages } = useSelector((state) => state.allTravel);

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

    // function pour trouver le prix du pack le moins cher :
    function cheapestPack(packs) {
        return Math.min(...packs.map(pack => parseInt(pack.price_adults)))
    }

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