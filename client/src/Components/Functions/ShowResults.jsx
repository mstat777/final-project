import styles from '../Containers/Search/search.module.css';

function ShowResults(props) {
    const { reference, 
            nom,
            pays,
            description,
            url} = props;

    return (
        <>
            <h2>Details:</h2>
            <article>
                <h3>{nom}</h3>
                <img src={"img/destinations/"+url} alt="" />
                <p>Réf. : {reference}</p>
                <p>Pays : {pays}</p>
                <p>Info : {description}</p>
            </article>
        </>
    )
}

export default ShowResults;