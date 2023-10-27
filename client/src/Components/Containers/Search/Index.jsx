import { useState, useEffect } from 'react';
import styles from './search.module.css';
import ShowResults from '../../Functions/ShowResults';
import { useDispatch, useSelector } from 'react-redux';
import { setDestination } from "../../../store/slices/travel";

function Search() {

    const dispatch = useDispatch();
    // pour stocker les destinations trouvées via le fetch
    const { destination } = useSelector((state) => state.allTravel);

    // stocker la valeur de l'input de la barre de recherche
    const [destinationInput, setDestinationInput] = useState("");
    // limiter le nb de résultats à afficher dans suggestions
    const maxResults = 10;
    //
    const [msg, setMsg] = useState(null);

    useEffect(() => {
        setDestination({});
    }, [])

    // en cliquant le bouton "RECHERCHER" :
    async function handleSubmit(e) {

        e.preventDefault();

        // on récupère les données de la destination :
        const dataDest = await (await fetch(`/api/v.0.1/travel/destination/${destinationInput}`)).json();

        if(dataDest.datas[0]){
            console.log("la destination a été trouvée dans la BD");
            localStorage.setItem("destination", JSON.stringify(dataDest.datas[0]));
            dispatch(setDestination(dataDest.datas[0]));
            console.log("dataDest.datas[0] = "+dataDest.datas[0]);
        } else {
            console.log("la destination n'a pas été trouvée!!!");
            //dispatch(setDestination({}));
        }

        setMsg(dataDest.msg);
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