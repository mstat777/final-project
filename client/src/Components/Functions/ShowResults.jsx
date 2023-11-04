import styles from '../Containers/Search/search.module.css';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { setPacks } from "../../store/slices/travel";

function ShowResults() {
    const dispatch = useDispatch();
    const { destination } = useSelector((state) => state.allTravel);
    const { packs } = useSelector((state) => state.allTravel);

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
        /*let lowestPrice = packs[0].prix_adulte;
        for (let pack of packs) {
            (pack.prix_adulte < lowestPrice) ? lowestPrice = pack.prix_adulte
        }*/
        return Math.min(...packs.map(pack => parseInt(pack.price_adults)))
    }

    return (
        <article>
            <img src={"img/destinations/"+destination.url_initial_image} alt="" />
            <h3>{destination.name}</h3>
            <p>Pays : {destination.country}</p>
            <p><i>Réf. : {destination.reference}</i></p>
            <p>Info : {destination.overview}</p>
            <p>dès {cheapestPack(packs)}&euro; TTC/adulte</p>
            <Link to={`/detail/${destination.name}`}>découvrir</Link>
        </article>
    )
}

export default ShowResults;