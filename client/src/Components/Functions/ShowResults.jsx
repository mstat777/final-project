import styles from '../Containers/Search/search.module.css';
import { Link } from 'react-router-dom';

function ShowResults(props) {
    const { reference, 
            dest_nom,
            pays,
            description,
            url} = props;
    console.log("dest_nom = "+dest_nom);
    return (
        <article>
            <img src={"img/destinations/"+url} alt="" />
            <h3>{dest_nom}</h3>
            <p><i>Réf. : {reference}</i></p>
            <p>Pays : {pays}</p>
            <p>Info : {description}</p>
            <Link to={`/detail/${dest_nom}`}>découvrir</Link>
        </article>
    )
}

export default ShowResults;