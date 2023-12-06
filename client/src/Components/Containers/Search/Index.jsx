import styles from './search.module.css';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { setDestination } from "../../../store/slices/travel";
import { fetchDestination, 
        fetchLodging,
        fetchPacks } from '../../Functions/fetchData';
import { formatCoordinates } from '../../Functions/utils';

import Results from '../Results/Index';
import Suggestions from './Suggestions/Index';

function Search() {
    // limiter les longueurs des inputs :
    const maxNameLength = 50;
    //
    const { pathname } = useLocation();
    //console.log("pathname= "+pathname);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [maxPrice, setMaxPrice] = useState("");
    const [departureDate, setDepartureDate] = useState("");
    // afficher le placeholder de la date de naissance :
    const [inputDateType, setInputDateType] = useState("text");
    
    const { allDestinations, destination, lodging } = useSelector((state) => state.allTravel);
    
    // la destination a fetcher (si existe)
    const [urlDestination, setUrlDestination] = useState(searchParams.get('destination'));

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

    // on prend l'entrée utilisateur et on vérifie si cette destination existe dans la BDD :
    useEffect(() => {
        async function checkDestination(){
            // pour le résultat de la .map() ci-dessous :
            let isFound = false;
            //console.log("checkDestination called");
            allDestinations.map((dest) => {
                // si la destination est trouvée :
                if (dest.toLowerCase() === searchDestination) {
                    isFound = true;
                    console.log("destinationFound est truefy. On va fetcher.");
                    fetchDestination(searchDestination);
                    setShowResults(true);
                    navigate(`/search?destination=${searchDestination}`);
                }
            });
            // afficher un msg si la destination n'a pas été trouvée :
            !isFound ? setMsg("Aucun résultat trouvé") : setMsg('');
        }
       
        if (searchDestination){
            console.log("searchDestination (init) = "+searchDestination);  
            // on vérifie la destination :
            checkDestination();
            // aussi on cache les suggestions :
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

    // lors du changement du texte dans la barre de recherche :
    function priceAlertMsg(e){
        e.target.setCustomValidity("Prix < 100000. Deux décimals max.");
    }
    
    // en cliquant le bouton "RECHERCHER" :
    function handleSubmit(e) {
        e.preventDefault();
        setSearchDestination(destinationInput.trim().toLowerCase());
    }

    return (
        <>
            <form onSubmit={handleSubmit} className={styles.search_form}>
                <div className={styles.inputs_ctn}>
                    <input type="text" 
                            name="destination" 
                            value={destinationInput}
                            onChange={handleChange}
                            onFocus={() => setMsg('')}
                            maxLength={maxNameLength}
                            placeholder="Destination"
                            required/>
                    <input type={inputDateType}  
                            name="departureDate" 
                            value={departureDate}
                            onChange={(e) => setDepartureDate(e.target.value)}
                            onFocus={() => {
                                setInputDateType("date"); 
                                setMsg('')}}
                            placeholder="Date de départ"/>
                    <input type="text" 
                            pattern="^\d{0,5}(\.\d{1,2})?$"
                            name="maxPrice" 
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            onFocus={() => setMsg('')}
                            onInvalid={priceAlertMsg}
                            onInput={(e) => e.target.setCustomValidity('')}
                            placeholder="Prix maximal"/>
                </div>
                <div className={styles.button_ctn}>
                    <button type="submit">rechercher</button>
                </div>
                <Suggestions 
                destinationInput={destinationInput} 
                setDestinationInput={setDestinationInput}
                showSuggestions={showSuggestions}
                setShowSuggestions={setShowSuggestions}
                setSearchDestination={setSearchDestination} />
            </form>

            { (msg) && 
                    <p className={styles.msg}>{msg}</p>}

            {/* Si on est sur la page d'accueil, on n'affiche pas "Results". On l'affiche si l'URL contient 'search' */}
            { (showResults && pathname.slice(1) === "search") && 
                <Results/> }
        </>
    )
}

export default Search;