import styles from './search.module.css';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { setDestination } from "../../../store/slices/travel";
import { fetchDestination } from '../../Functions/fetchData';
import ShowResults from '../../Functions/ShowResults';
import Suggestions from './Suggestions/Index';

function Search() {
    // toutes les destinations :
    const { allDestinations } = useSelector((state) => state.allTravel);

    // les destinations trouvées via le fetch :
    const { destination } = useSelector((state) => state.allTravel);

    // stocker la valeur de l'input de la barre de recherche
    const [destinationInput, setDestinationInput] = useState("");

    const [msg, setMsg] = useState("");

    // supprimer l'ancienne destination lors du rafraichissement :
    useEffect(() => {
        setDestination({});
        setMsg("");
    }, []);

    // lors du changement du texte dans la barre de recherche :
    function handleChange(e){
        setDestinationInput(e.target.value);
    }
    
    // en cliquant le bouton "RECHERCHER" :
    async function handleSubmit(e) {
        e.preventDefault();
        if (allDestinations.includes(destinationInput)) {
            fetchDestination(destinationInput);
        } else {
            setMsg("Aucun résultat trouvé");
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit} className={styles.search_form}>
                <input type="text" 
                        id="destination" 
                        name="destination" 
                        value={destinationInput}
                        onChange={handleChange}
                        placeholder="Destination (pays, ville)"/>
                <input type="date" 
                        id="departureDate" 
                        name="departureDate" 
                        placeholder="Date de départ"/>
                <input type="number" 
                        id="maxPrice" 
                        name="maxPrice" 
                        placeholder="Prix maximal"/>
                <button type="submit">rechercher</button>
                <Suggestions destinationInput={destinationInput} />
            </form>
            { msg && <p className={styles.msg}>{msg}</p>}

            { (destinationInput && destination.name != undefined) &&
            ((destinationInput.toLowerCase() === destination.name.toLowerCase()) &&
                <section id="resultsContainer" className={styles.results_section}>
                    <ShowResults /> 
                </section>
            )}
        </>
    )
}

export default Search;