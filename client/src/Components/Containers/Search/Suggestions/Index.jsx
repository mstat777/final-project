import styles from '../search.module.css';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { fetchLodging, fetchPacks } from '../../../Functions/fetchData.js';
import { formatCoordinates } from '../../../Functions/utils.js';

function Suggestions(props){
    const { destinationInput, 
            setDestinationInput,
            showSuggestions,
            setShowSuggestions,
            setSearchDestination } = props;
    // toutes les destinations :
    const { allDestinations } = useSelector((state) => state.allTravel);
    const { destination } = useSelector((state) => state.allTravel);
    const { lodging } = useSelector((state) => state.allTravel);
    // stocker le texte entré par l'utilisateur une fois formaté
    const [textEntered, setTextEntered] = useState("");
    
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

    async function handleClick(e){
        setDestinationInput(e.target.innerText);
        setSearchDestination(e.target.innerText.toLowerCase());
        setTextEntered("");
        //await fetchDestination(e.target.innerText.toLowerCase());
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