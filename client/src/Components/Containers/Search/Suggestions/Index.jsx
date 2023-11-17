import styles from '../search.module.css';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { fetchDestination } from '../../../Functions/fetchData.js';

function Suggestions(props){
    const { destinationInput } = props;
    // toutes les destinations :
    const { allDestinations } = useSelector((state) => state.allTravel);

    const [textEntered, setTextEntered] = useState("");

    useEffect(() => {
        let tempArray = destinationInput.trim();
        tempArray = tempArray.charAt(0).toUpperCase() + tempArray.slice(1);
        setTextEntered(tempArray);
    },[destinationInput]);

    return <>
            {allDestinations.length > 0 && 
            <ul className={`${styles.suggestions_box} ${destinationInput && styles.hide}`}>
                {allDestinations.filter(dest => dest.startsWith(textEntered)).map((filteredDest, index) => 
                    <li key={index} 
                        onClick={() => fetchDestination(filteredDest.toLowerCase)}
                        >
                        {filteredDest}
                    </li> 
                )}
            </ul>}
            </>
}

export default Suggestions;