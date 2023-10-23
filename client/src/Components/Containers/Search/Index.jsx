import { useState } from 'react';
import styles from './search.module.css';
import ShowResults from '../../Functions/ShowResults';
import { useDispatch } from 'react-redux';
import { choosenDestination } from '../../../store/slices/user';
import { setDestination } from "../../../store/slices/travel";

function Search() {

    const dispatch = useDispatch();
    // pour stocker les destinations trouvées via le fetch
    const [selectedDestination, setSelectedDestination] = useState(null);
    // hook pour la barre de recherche
    const [destinationInput, setDestinationInput] = useState("");
    // limiter le nb de résultats à afficher dans suggestions
    const maxResults = 10;
    //
    const [msg, setMsg] = useState(null);

    // en cliquant le bouton "RECHERCHER" :
    async function handleSubmit(e) {
        e.preventDefault();
        // on récupère les données de la destination :
        const dataDest = await (await fetch(`/api/v.0.1/travel/destination/${destinationInput}`)).json();

        setMsg(dataDest.msg);

        if(dataDest.datas[0]){
            console.log("la destination a été trouvée dans la BD");
            setSelectedDestination(dataDest.datas[0]);
            dispatch(setDestination(dataDest.datas[0]));
            localStorage.setItem("destination", JSON.stringify(dataDest.datas[0]));
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

            { selectedDestination &&
                <section id="resultsContainer" className={styles.results_section}>
                    <ShowResults 
                        reference={selectedDestination.reference}
                        dest_nom={selectedDestination.dest_nom}
                        pays={selectedDestination.pays}
                        description={selectedDestination.description}
                        url={selectedDestination.url_image_initiale}
                    /> 
                </section>
            }
            
        </>
    )
}

export default Search;