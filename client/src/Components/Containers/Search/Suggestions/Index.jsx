import styles from '../search.module.css';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { fetchDestination } from '../../../Functions/fetchData.js';

function Suggestions(props){
    const { destinationInput, setDestinationInput } = props;
    // toutes les destinations :
    const { allDestinations } = useSelector((state) => state.allTravel);
    // stocker le texte entré par l'utilisateur une fois formaté
    const [textEntered, setTextEntered] = useState("");

    useEffect(() => {
        let tempArray = destinationInput.trim();
        tempArray = tempArray.charAt(0).toUpperCase() + tempArray.slice(1);
        setTextEntered(tempArray);
    },[destinationInput]);

    function handleClick(e){
        console.log(e.target.innerText.toLowerCase());
        setDestinationInput(e.target.innerText);
        fetchDestination(e.target.innerText.toLowerCase());
    }

    return <>
            {(allDestinations.length > 0 && textEntered) && 
            <ul className={styles.suggestions_box}>
                {allDestinations.filter(dest => dest.startsWith(textEntered)).map((filteredDest, index) => 
                    <li key={index} onClick={handleClick}>
                        {filteredDest}
                    </li> 
                )}
            </ul>}
            </>
}

export default Suggestions;