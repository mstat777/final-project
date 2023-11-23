import styles from './search.module.css';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { setDestination } from "../../../store/slices/travel";
import { fetchDestination, 
        fetchLodging,
        fetchPacks } from '../../Functions/fetchData';
import { formatCoordinates } from '../../Functions/utils';
import Results from '../Results/Index';
import Suggestions from './Suggestions/Index';
import { useNavigate, useSearchParams } from 'react-router-dom';

function Search() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    //console.log(searchParams);
    
    const { allDestinations, destination, lodging } = useSelector((state) => state.allTravel);
    
    // la destination a fetcher (si existe)
    const [urlDestination, setUrlDestination] = useState(searchParams.get('destination'));
    //console.log("urlDestination = "+searchParams.get('destination'));
    // stocker la valeur de l'input de la barre de recherche
    const [destinationInput, setDestinationInput] = useState("");
    // la destination a fetcher (si existe)
    const [searchDestination, setSearchDestination] = useState("");


    // afficher le containeur des résultats :
    const [showResults, setShowResults] = useState(false);
    // aficher/cacher les suggestions :
    const [showSuggestions, setShowSuggestions] = useState(false);

    // afficher un message si la destination n'est pas trouvée  
    const [msg, setMsg] = useState("");

    // supprimer l'ancienne destination lors du rafraichissement, le message d'erreur, cacher les résultats, récupérer la destination de la requête URL (si existe) :
    useEffect(() => {
        setDestination({});
        setMsg("");
        setShowResults(false);

        if(!searchDestination){
            //console.log("searchDestination doesn't existe !");
            if (urlDestination){
                setSearchDestination(urlDestination);
            }
        }
    }, []);

    // une fois la destination définie, on la vérifie et cache les suggestions :
    useEffect(() => {
        async function checkDestination(){
            //console.log("checkDestination called");
            allDestinations.map((dest) => {
                //console.log("dest.toLowerCase() = "+dest.toLowerCase());
                if (dest.toLowerCase() === searchDestination) {
                    console.log("destinationFound est truefy. On va fetcher.");
                    fetchDestination(searchDestination);
                    setShowResults(true);
                    navigate(`/search?destination=${searchDestination}`);
                }
            });
        }

        if (searchDestination){
            console.log("searchDestination (init) = "+searchDestination);  
            checkDestination();
            setShowSuggestions(false);
        }
    },[searchDestination]);

    //
    useEffect(() => {
        if (destination.lodging_id) {
            fetchLodging(destination.lodging_id);
            fetchPacks(destination.id);
        }
    },[destination]);

    // formatter les coordonnées de l'hébérgement :
    useEffect(() => {
        if (lodging !== undefined) {
            if (lodging.coordinates) {
                formatCoordinates(lodging.coordinates);
            }  
        }
    },[lodging]);

    // lors du changement du texte dans la barre de recherche :
    function handleChange(e){
        setDestinationInput(e.target.value);
        if (e.target.value) {
            setShowSuggestions(true);
        }
    }
    
    // en cliquant le bouton "RECHERCHER" :
    function handleSubmit(e) {
        e.preventDefault();
        setSearchDestination(destinationInput.trim().toLowerCase());
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
                <Suggestions 
                destinationInput={destinationInput} 
                setDestinationInput={setDestinationInput}
                showSuggestions={showSuggestions}
                setShowSuggestions={setShowSuggestions}
                setSearchDestination={setSearchDestination} />
            </form>
            { (msg && !destinationInput) && 
                    <p className={styles.msg}>{msg}</p>}

            { showResults && <Results/>}
        </>
    )
}

export default Search;