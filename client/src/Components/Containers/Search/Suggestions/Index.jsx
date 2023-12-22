import styles from '../search.module.css';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

function Suggestions(props){
    const { destinationInput, 
            setDestinationInput } = props;

    // toutes les destinations du Store :
    const { allDestinations } = useSelector((state) => state.allTravel);

    // formatter l'entré user pour pouvoir filtrer les résultats :
    const [textEntered, setTextEntered] = useState("");

    // aficher/cacher les suggestions :
    const [showSuggestions, setShowSuggestions] = useState(false);
    
    // pour ne plus afficher les suggestions, si en clické sur un
    const [isSuggestionUsed, setIsSuggestionUsed] = useState(false);

    useEffect(() => {
        if (destinationInput){        
            let temp = destinationInput.trim();
            temp = temp.charAt(0).toUpperCase() + temp.slice(1);
            setTextEntered(temp);
            if (!isSuggestionUsed) {
                setShowSuggestions(true);
            } else {
                setShowSuggestions(false);
                setIsSuggestionUsed(false);
            }     
        }
    },[destinationInput]);

    async function handleClick(e){
        setTextEntered("");
        setIsSuggestionUsed(true);
        setShowSuggestions(false);
        setDestinationInput(e.target.innerText);
    }

    return (allDestinations.length > 0 && textEntered && showSuggestions) && 
            <ul className={styles.suggestions_box}>    
                {allDestinations.filter(dest => dest.startsWith(textEntered)).map((filteredDest, i) => 
                    <li key={i} onClick={handleClick}>
                        {filteredDest}
                    </li> 
                )}
            </ul>
}

export default Suggestions;