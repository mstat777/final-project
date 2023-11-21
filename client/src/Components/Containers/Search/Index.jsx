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

function Search() {
    // toutes les destinations :
    const { allDestinations } = useSelector((state) => state.allTravel);

    // les destinations trouvées via le fetch :
    const { destination, lodging } = useSelector((state) => state.allTravel);

    // stocker la valeur de l'input de la barre de recherche
    const [destinationInput, setDestinationInput] = useState("");

    // la destination cherchée est trouvée ou pas ?
    const [destinationFound, setDestinationFound] = useState(false);

    // afficher le containeur des résultats :
    const [showResults, setShowResults] = useState(false);

    // vérification si l'entrée de l'utilisateur matche l'une des destinations. On passe les deux variables en minuscules:
    function checkDestination(){
        allDestinations.map((dest) => {
            //console.log("dest.toLowerCase() = "+dest.toLowerCase());
            //console.log("destinationInput.trim().toLowerCase() = "+destinationInput.trim().toLowerCase());
            if (dest.toLowerCase() === destinationInput.trim().toLowerCase()) {
                console.log("MATCH !!!");
                setDestinationFound(true);
                setShowResults(true);
            }
        })
    }

    // Si la destination existe dans la BDD. on fetch :
    useEffect(() => {
        if (destinationFound) {
            console.log("destinationFound est truefy. On va fetcher.");
            fetchDestination(destinationInput);
        } else {
            setMsg("Aucun résultat trouvé");
        }
    },[destinationFound])

    //
    useEffect(() => {
        if (destination.lodging_id) {
            fetchLodging(destination.lodging_id);
            fetchPacks(destination.id);
        }
    },[destination]);

    // afficher un message si la destination n'est pas trouvée  
    const [msg, setMsg] = useState("");

    // supprimer l'ancienne destination lors du rafraichissement :
    useEffect(() => {
        setDestination({});
        setMsg("");
    }, []);

    // formatter les coordonnées de l'hébérgement :
    useEffect(() => {
        if (lodging != undefined) {
            if (lodging.coordinates) {
                //console.log("lodging.coordinates = "+lodging.coordinates);
                formatCoordinates(lodging.coordinates);
            }  
        }
    },[lodging]);

    // lors du changement du texte dans la barre de recherche :
    function handleChange(e){
        setDestinationInput(e.target.value);
        setShowResults(false);
    }
    
    // en cliquant le bouton "RECHERCHER" :
    async function handleSubmit(e) {
        e.preventDefault();
        // on vérifie si la destination cherchée existe
        checkDestination();
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
                <Suggestions destinationInput={destinationInput} setDestinationInput={setDestinationInput}/>
            </form>
            { (msg && !destinationInput) && 
                    <p className={styles.msg}>{msg}</p>}

            { showResults && <Results/>}
        </>
    )
}

export default Search;