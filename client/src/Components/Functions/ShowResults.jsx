import styles from '../Containers/Search/search.module.css';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function ShowResults() {
    const { destination } = useSelector((state) => state.allTravel);
    const { packs } = useSelector((state) => state.allTravel);

    // function pour trouver le prix du pack le moins cher :
    function cheapestPack(packs) {
        /*let lowestPrice = packs[0].prix_adulte;
        for (let pack of packs) {
            (pack.prix_adulte < lowestPrice) ? lowestPrice = pack.prix_adulte
        }*/
        return Math.min(...packs.map(pack => parseInt(pack.prix_adulte)))
    }

    return (
        <article>
            <img src={"img/destinations/"+destination.url_image_initiale} alt="" />
            <h3>{destination.nom}</h3>
            <p>Pays : {destination.pays}</p>
            <p><i>Réf. : {destination.reference}</i></p>
            <p>Info : {destination.description}</p>
            <p>dès {cheapestPack(packs)}&euro; TTC/adulte</p>
            <Link to={`/detail/${destination.nom}`}>découvrir</Link>
        </article>
    )
}

export default ShowResults;