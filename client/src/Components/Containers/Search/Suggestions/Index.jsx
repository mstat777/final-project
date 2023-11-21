import styles from '../search.module.css';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { fetchDestination, 
        fetchLodging,
        fetchPacks } from '../../../Functions/fetchData.js';
import { formatCoordinates } from '../../../Functions/utils.js';

function Suggestions(props){
    const { destinationInput, setDestinationInput } = props;
    // toutes les destinations :
    const { allDestinations } = useSelector((state) => state.allTravel);
    const { destination } = useSelector((state) => state.allTravel);
    const { lodging } = useSelector((state) => state.allTravel);
    // stocker le texte entré par l'utilisateur une fois formaté
    const [textEntered, setTextEntered] = useState("");
    // aficher/cacher les suggestions :
    const [showSuggestions, setShowSuggestions] = useState(false);
    // ce state évoque le changement du state showSuggestions :
    const [hide, setHide] = useState(false);

    useEffect(() => {
        let tempArray = destinationInput.trim();
        tempArray = tempArray.charAt(0).toUpperCase() + tempArray.slice(1);
        setTextEntered(tempArray);
        setShowSuggestions(true);
    },[destinationInput]);

    useEffect(() => {
        setShowSuggestions(false);
    },[hide]);

    useEffect(() => {
        if (destination.lodging_id) {
            fetchLodging(destination.lodging_id);
            fetchPacks(destination.id);
        }
    },[destination]);

    // formatter les coordonnées de l'hébérgement :
    useEffect(() => {
        if (lodging != undefined) {
            if (lodging.coordinates) {
                //console.log("lodging.coordinates = "+lodging.coordinates);
                formatCoordinates(lodging.coordinates);
            }  
        } 
    },[lodging]);

    async function handleClick(e){
        setDestinationInput(e.target.innerText);
        await fetchDestination(e.target.innerText.toLowerCase());
        setTextEntered("");
        setHide(true);
    }

    return <>
            {(allDestinations.length > 0 && textEntered && showSuggestions) && 
            <ul className={styles.suggestions_box}>
                
                {allDestinations.filter(dest => dest.startsWith(textEntered)).map((filteredDest, index) => 
                    <li key={index} onClick={handleClick}>
                        {filteredDest}
                    </li> 
                )}
            </ul>
            }
            </>
}

export default Suggestions;