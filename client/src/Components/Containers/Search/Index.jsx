import { useState, useEffect } from 'react';
import styles from './search.module.css';
import ShowResults from '../../Functions/ShowResults';
import { useDispatch, useSelector } from 'react-redux';
import { setDestination, setPacks } from "../../../store/slices/travel";

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
        setPacks([]);
    }, [])

    // on récupère les données des packs :
    useEffect(() => {
        async function fetchData() {
            try {
                const dataPack = await (await fetch(`/api/v.0.1/travel/pack/${destination.id}`)).json();
                console.log("des packs ont été trouvés dans la BD");
                dispatch(setPacks(dataPack.datas));
                localStorage.setItem("packs", JSON.stringify(dataPack.datas));
            } catch (error) {
                console.log("aucun pack n'a été trouvé !!!");
                console.log(error);
            }
        }
        fetchData();
    }, [destination])

    // en cliquant le bouton "RECHERCHER" :
    async function handleSubmit(e) {

        e.preventDefault();

        // on récupère les données de la destination :
        const dataDest = await (await fetch(`/api/v.0.1/travel/destination/${destinationInput}`)).json();

        if(dataDest.datas[0]){
            console.log("la destination a été trouvée dans la BD");
            dispatch(setDestination(dataDest.datas[0]));
            localStorage.setItem("destination", JSON.stringify(dataDest.datas[0]));
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
            { (destinationInput && destination.nom != undefined) &&
            ((destinationInput.toLowerCase() === destination.nom.toLowerCase()) &&
                <section id="resultsContainer" className={styles.results_section}>
                    <ShowResults /> 
                </section>
            )}
        </>
    )
}

export default Search;