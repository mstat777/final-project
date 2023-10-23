import { useState, useEffect } from 'react';
import styles from './search.module.css';
import ShowResults from '../../Functions/ShowResults';
import { useDispatch } from 'react-redux';
import { choosenDestination } from '../../../store/slices/user';

function Search() {

    const dispatch = useDispatch();
    // pour stocker les destinations trouvées via le fetch
    const [destinations, setDestinations] = useState([]);
    //
    const [selectedDestination, setSelectedDestination] = useState(null);
    // hook pour la barre de recherche
    const [destinationInput, setDestinationInput] = useState("");
    // limiter le nb de résultats à afficher dans suggestions
    const maxResults = 10;
    //
    const [msg, setMsg] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        //console.log("destinationInput : "+destinationInput);
        const res = await fetch(`/api/v.0.1/travel/destination/${destinationInput}`);
        const json = await res.json();
        setMsg(json.msg);
        if(res.status === 200 && json.datas[0]){
            console.log("la destination a été trouvée dans la BD");
            setSelectedDestination(json.datas[0]);
            dispatch(choosenDestination({destinationInput}));
        } else {
            console.log("la destination n'a pas été trouvée!!!");
            setSelectedDestination(null);
            dispatch(choosenDestination({}));
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit} className={styles.search_form}>
                <input type="text" 
                        id="destination" 
                        name="destination" 
                        value={destinationInput}
                        onChange={(e) => setDestinationInput(e.target.value)}
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

            </form>

            <section id="resultsContainer" className={styles.results_section}>
                { selectedDestination &&
                    <ShowResults 
                        reference={selectedDestination.reference}
                        nom={selectedDestination.nom}
                        pays={selectedDestination.pays}
                        description={selectedDestination.description}
                        url={selectedDestination.url_image_initiale}
                    /> 
                }
            </section>
        </>
    )
}

export default Search;